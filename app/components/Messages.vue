<template>
  <div class="messages-page">
    <!-- CONVERSATION LIST -->
    <div class="conv-pane">
      <div class="conv-pane-header">
        <h2 class="conv-title">Conversations</h2>
        <span class="compliance-badge"><Lock :size="11" /> RA 10173</span>
      </div>

      <div class="search-row">
        <div class="search-wrap">
          <Search :size="16" class="search-icon" />
          <input v-model="searchQuery" type="text" class="search-input" placeholder="Search conversations..." />
        </div>
        <button class="new-conv-btn" type="button" aria-label="New conversation">
          <Plus :size="16" />
        </button>
      </div>

      <div v-if="filteredConversations.length" class="conv-list">
        <button
          v-for="conv in filteredConversations"
          :key="conv.id"
          class="conv-item"
          :class="{ active: activeConversationId === conv.id }"
          @click="activeConversationId = conv.id"
        >
          <div class="conv-avatar-wrap">
            <div class="conv-avatar" :style="{ background: conv.avatarColor }">{{ conv.initials }}</div>
            <span v-if="conv.online" class="online-dot"></span>
          </div>
          <div class="conv-body">
            <div class="conv-top">
              <span class="conv-name">{{ conv.name }}</span>
              <span class="conv-time">{{ conv.lastMessageAt }}</span>
            </div>
            <p class="conv-preview">{{ conv.lastMessage }}</p>
          </div>
          <span v-if="conv.unreadCount" class="unread-badge">{{ conv.unreadCount }}</span>
        </button>
      </div>

      <div v-else class="conv-empty">
        <p class="empty-title">No conversations yet</p>
        <p class="empty-desc">Messages with your RND will show up here.</p>
      </div>
    </div>

    <!-- CHAT PANEL -->
    <div class="chat-pane">
      <template v-if="activeConversation">
        <div class="chat-header">
          <div class="chat-who">
            <div class="chat-avatar" :style="{ background: activeConversation.avatarColor }">{{ activeConversation.initials }}</div>
            <div>
              <p class="chat-name">{{ activeConversation.name }}</p>
              <!-- TODO: "condition" isn't in the mock db yet — wire this up once available -->
              <p class="chat-sub">RA 10173-compliant<template v-if="activeConversation.condition"> · {{ activeConversation.condition }}</template></p>
            </div>
          </div>
          <div class="chat-header-right">
            <span v-if="activeConversation.online" class="online-status"><span class="status-dot" /> Online</span>
            <button class="video-btn" type="button" aria-label="Start video call">
              <Video :size="17" />
            </button>
          </div>
        </div>

        <div class="chat-body">
          <div class="date-divider"><span>Today</span></div>

          <div v-for="msg in activeMessages" :key="msg.id" class="msg-block" :class="msg.sender === 'me' ? 'msg-block-me' : 'msg-block-them'">
            <span class="msg-sender">{{ msg.sender === 'me' ? 'You' : activeConversation.name }}</span>
            <div class="msg-bubble" :class="msg.sender === 'me' ? 'bubble-me' : 'bubble-them'">
              {{ msg.text }}
            </div>
            <span class="msg-time">{{ msg.time }}</span>
          </div>

          <!-- TODO: wire up to a real typing-indicator signal (e.g. websocket presence) -->
          <div v-if="activeConversation.isTyping" class="msg-block msg-block-them">
            <span class="msg-sender">{{ activeConversation.name }}</span>
            <div class="msg-bubble bubble-them typing-bubble">
              <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
            </div>
          </div>
        </div>

        <div class="chat-input-row">
          <button class="attach-btn" type="button" aria-label="Attach file">
            <Paperclip :size="17" />
          </button>
          <input
            v-model="draft"
            type="text"
            class="chat-input"
            placeholder="Type a message..."
            @keyup.enter="sendMessage"
          />
          <button class="send-btn" type="button" aria-label="Send message" @click="sendMessage">
            <Send :size="16" />
          </button>
        </div>
      </template>

      <div v-else class="chat-empty">
        <div class="empty-icon"><MessageCircle :size="28" /></div>
        <p class="empty-title">Select a conversation</p>
        <p class="empty-desc">Choose a conversation on the left to start chatting.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Search, Send, MessageCircle, Lock, Plus, Paperclip, Video } from 'lucide-vue-next'
import { db } from '~/mock/mockDatabase'

definePageMeta({ layout: 'dashboard', title: 'Messages' })

const searchQuery = ref('')
const draft = ref('')

// TODO: db.conversations / db.messagesByConversation don't exist in mockDatabase.js
// yet — add them there. Falling back to empty here so the page doesn't crash.
const conversations = ref(db.conversations || [])
const messagesByConversation = ref(db.messagesByConversation || {})

const activeConversationId = ref(conversations.value[0]?.id ?? null)

const filteredConversations = computed(() => {
  if (!searchQuery.value.trim()) return conversations.value
  const q = searchQuery.value.toLowerCase()
  return conversations.value.filter(c => c.name.toLowerCase().includes(q))
})

const activeConversation = computed(() =>
  conversations.value.find(c => c.id === activeConversationId.value) ?? null
)

const activeMessages = computed(() =>
  activeConversationId.value ? (messagesByConversation.value[activeConversationId.value] ?? []) : []
)

function sendMessage() {
  const text = draft.value.trim()
  if (!text || !activeConversationId.value) return

  // Wire this up to your real send-message API call
  const thread = messagesByConversation.value[activeConversationId.value] ?? []
  thread.push({
    id: `msg-${Date.now()}`,
    sender: 'me',
    text,
    time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  })
  messagesByConversation.value[activeConversationId.value] = thread
  draft.value = ''
}
</script>

<style scoped>
* { box-sizing: border-box; }

.messages-page {
  font-family: 'Inter', sans-serif;
  display: grid; grid-template-columns: 320px 1fr;
  height: calc(100vh - 140px); min-height: 540px;
  background: #fff; border-radius: 12px; border: 1px solid #CBD5E1; overflow: hidden;
}npm 

/* CONVERSATION LIST */
.conv-pane { border-right: 1px solid #CBD5E1; display: flex; flex-direction: column; }

.conv-pane-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 16px 14px; }
.conv-title { font-family: 'Playfair Display', serif; font-size: 1.15rem; color: #1a3a1a; margin: 0; }
.compliance-badge {
  display: flex; align-items: center; gap: 4px; background: #f0f2ef; color: #6a7a6a;
  font-size: 0.68rem; font-weight: 700; padding: 4px 9px; border-radius: 12px; white-space: nowrap;
}

.search-row { display: flex; align-items: center; gap: 8px; padding: 0 16px 16px; }
.search-wrap { position: relative; flex: 1; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9aaa9a; }
.search-input {
  width: 100%; border: 1px solid #d5dad5; border-radius: 8px; padding: 10px 12px 10px 36px;
  font-size: 0.85rem; font-family: inherit; color: #2a2a2a;
}
.search-input:focus { outline: none; border-color: #D4A017; }
.new-conv-btn {
  width: 36px; height: 36px; border-radius: 8px; border: none; background: #14301a; color: #fff;
  display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
}

.conv-list { flex: 1; overflow-y: auto; }
.conv-item {
  width: 100%; display: flex; align-items: flex-start; gap: 12px; text-align: left;
  padding: 14px 16px; border: none; border-bottom: 1px solid #f3f4f0; background: #fff; cursor: pointer;
  border-left: 3px solid transparent;
}
.conv-item.active { background: #f4f2e9; border-left-color: #D4A017; }
.conv-avatar-wrap { position: relative; flex-shrink: 0; }
.conv-avatar {
  width: 36px; height: 36px; border-radius: 50%; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 0.78rem; font-weight: 700;
}
.online-dot { position: absolute; bottom: 0; right: 0; width: 9px; height: 9px; border-radius: 50%; background: #3a9a4a; border: 2px solid #fff; }
.conv-body { flex: 1; min-width: 0; }
.conv-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.conv-name { font-size: 0.88rem; font-weight: 700; color: #1a3a1a; }
.conv-time { font-size: 0.72rem; color: #9aaa9a; flex-shrink: 0; }
.conv-preview {
  font-size: 0.8rem; color: #8a9a8a; margin: 3px 0 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.unread-badge {
  background: #D4A017; color: #1a3a1a; font-size: 0.68rem; font-weight: 700;
  width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 2px;
}

.conv-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; text-align: center; }

/* CHAT PANEL */
.chat-pane { display: flex; flex-direction: column; background: #fff; }

.chat-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 22px; background: #fff; border-bottom: 1px solid #CBD5E1;
}
.chat-who { display: flex; align-items: center; gap: 12px; }
.chat-avatar {
  width: 38px; height: 38px; border-radius: 50%; color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700;
}
.chat-name { font-size: 0.94rem; font-weight: 700; color: #1a3a1a; margin: 0; }
.chat-sub { font-size: 0.78rem; color: #8a9a8a; margin: 2px 0 0; }
.online-status { display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 600; color: #2e9e52; }
.chat-header-right { display: flex; align-items: center; gap: 14px; }
.video-btn {
  width: 34px; height: 34px; border-radius: 50%; border: none; background: #eceeec; color: #2a2a2a;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.video-btn:hover { background: #dfe2df; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background: #2e9e52; }

.chat-body { flex: 1; overflow-y: auto; padding: 24px 28px; background: #fff; }
.date-divider { text-align: center; margin-bottom: 20px; }
.date-divider span {
  font-size: 0.72rem; letter-spacing: 0.06em; color: #9aaa9a; text-transform: uppercase;
}

.msg-block { display: flex; flex-direction: column; margin-bottom: 20px; max-width: 60%; }
.msg-block-them { align-items: flex-start; }
.msg-block-me { align-items: flex-end; margin-left: auto; }
.msg-sender { font-size: 0.78rem; font-weight: 700; color: #4a5a4a; margin-bottom: 5px; }

.msg-bubble { padding: 12px 16px; border-radius: 12px; font-size: 0.86rem; line-height: 1.5; }
.bubble-them { background: #f4f6f4; color: #2a2a2a; }
.bubble-me { background: #14301a; color: #fff; }
.msg-time { font-size: 0.72rem; color: #9aaa9a; margin-top: 5px; }

.typing-bubble { display: flex; align-items: center; gap: 4px; padding: 14px 16px; }
.typing-dot { width: 6px; height: 6px; border-radius: 50%; background: #9aaa9a; animation: typing-bounce 1.2s infinite ease-in-out; }
.typing-dot:nth-child(2) { animation-delay: 0.15s; }
.typing-dot:nth-child(3) { animation-delay: 0.3s; }
@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-4px); opacity: 1; }
}

.chat-input-row {
  display: flex; align-items: center; gap: 10px; padding: 16px 22px;
  background: #fff; border-top: 1px solid #CBD5E1;
}
.attach-btn {
  width: 38px; height: 38px; border-radius: 50%; border: none; background: none; color: #6a7a6a;
  display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
}
.attach-btn:hover { background: #f4f6f4; }
.chat-input {
  flex: 1; border: 1px solid #d5dad5; border-radius: 20px; padding: 11px 16px;
  font-size: 0.86rem; font-family: inherit; color: #2a2a2a;
}
.chat-input:focus { outline: none; border-color: #D4A017; }
.send-btn {
  width: 38px; height: 38px; border-radius: 50%; border: none; background: #14301a; color: #fff;
  display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
}

.chat-empty {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;
}
.empty-icon {
  width: 56px; height: 56px; border-radius: 50%; background: #eef3ec; color: #1e4a26;
  display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
}
.empty-title { font-family: 'Playfair Display', serif; font-size: 1.05rem; color: #1a3a1a; margin: 0 0 6px; }
.empty-desc { font-size: 0.84rem; color: #8a9a8a; margin: 0; }
</style>