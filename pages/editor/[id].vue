<template>
  <div class="flex flex-col md:flex-row w-full h-[calc(100vh-120px)]">
    <!-- Main Editor Area -->
    <div class="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
      <!-- Editor Toolbar -->
      <div class="border-b border-gray-200 dark:border-gray-800 p-2 flex items-center gap-2">
        <UButton
          icon="i-mdi-arrow-left"
          color="gray"
          variant="ghost"
          @click="navigateBack"
        />
        
        <UInput
          v-model="paper.title"
          placeholder="Untitled Paper"
          class="flex-1"
          size="lg"
          variant="none"
          :class="{'text-gray-500': !paper.title}"
        />
        
        <UButton
          icon="i-mdi-content-save"
          color="primary"
          :loading="isSaving"
          :disabled="isSaving"
          @click="savePaper"
        >
          {{ autoSaved ? 'Saved' : 'Save' }}
        </UButton>
      </div>
      
      <!-- Format Toolbar -->
      <EditorToolbar
        v-if="editor"
        :editor="editor"
        class="border-b border-gray-200 dark:border-gray-800 p-2"
      />
      
      <!-- Rich Text Editor -->
      <div class="flex-1 overflow-auto bg-white dark:bg-gray-900">
        <div class="container mx-auto px-4 py-6 max-w-4xl">
          <ClientOnly>
            <EditorContent
              :editor="editor"
              class="editor-content min-h-[500px] border rounded-lg p-4"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
    
    <!-- Reference Sidebar -->
    <div
      v-if="showReferenceSidebar" 
      class="w-full md:w-96 border-l border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50 dark:bg-gray-900"
    >
      <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 class="font-semibold">References</h3>
        <UButton
          icon="i-mdi-close"
          color="gray"
          variant="ghost"
          @click="toggleReferenceSidebar"
        />
      </div>
      
      <div class="flex-1 overflow-auto p-4">
        <UInput
          v-model="searchQuery"
          placeholder="Search references..."
          icon="i-mdi-magnify"
          class="mb-4"
        />
        
        <div v-if="filteredReferences.length" class="space-y-4">
          <ReferenceCard
            v-for="ref in filteredReferences"
            :key="ref.id"
            :reference="ref"
            :active="selectedReferenceId === ref.id"
            @click="selectReference(ref.id)"
            @cite="citeReference"
          />
        </div>
        
        <div v-else class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400 mb-4">No references found</p>
          <UButton
            icon="i-mdi-plus"
            color="primary"
            @click="openAddReferenceModal"
          >
            Add Reference
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { useRouter, useRoute } from 'vue-router'
import { usePaperStore } from '~/stores/paper'
import { useReferenceStore } from '~/stores/reference'

const router = useRouter()
const route = useRoute()
const paperStore = usePaperStore()
const referenceStore = useReferenceStore()

// Paper data
const paper = ref({
  id: '',
  title: '',
  content: '',
  references: []
})

// Editor state
const isSaving = ref(false)
const autoSaved = ref(false)
const lastSaveTimeout = ref(null)

// Reference sidebar state
const showReferenceSidebar = ref(true)
const searchQuery = ref('')
const selectedReferenceId = ref(null)

// Initialize the editor
const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Underline,
    Link.configure({
      openOnClick: false
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph']
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none'
    }
  },
  onUpdate: ({ editor }) => {
    paper.value.content = editor.getHTML()
    scheduleAutoSave()
  }
})

// Load paper data
onMounted(async () => {
  const paperId = route.params.id
  
  if (paperId === 'new') {
    paper.value = {
      id: 'new',
      title: 'Untitled Paper',
      content: '',
      references: []
    }
  } else {
    const loadedPaper = await paperStore.fetchPaper(paperId)
    if (loadedPaper) {
      paper.value = { ...loadedPaper }
      
      if (editor.value) {
        editor.value.commands.setContent(paper.value.content)
      }
    } else {
      router.push('/editor/new')
    }
  }
  
  await referenceStore.fetchReferences()
})

onBeforeUnmount(() => {
  if (lastSaveTimeout.value) {
    clearTimeout(lastSaveTimeout.value)
  }
})

// Filtered references based on search
const filteredReferences = computed(() => {
  let refs = referenceStore.references
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    refs = refs.filter(ref => 
      ref.title.toLowerCase().includes(query) || 
      ref.authors.toLowerCase().includes(query)
    )
  }
  
  return refs
})

// Schedule auto-save
function scheduleAutoSave() {
  if (lastSaveTimeout.value) {
    clearTimeout(lastSaveTimeout.value)
  }
  
  autoSaved.value = false
  lastSaveTimeout.value = setTimeout(async () => {
    await savePaper()
    autoSaved.value = true
  }, 3000)
}

// Save paper
async function savePaper() {
  isSaving.value = true
  try {
    const savedPaper = await paperStore.savePaper(paper.value)
    if (paper.value.id === 'new' && savedPaper.id) {
      router.replace(`/editor/${savedPaper.id}`)
      paper.value = savedPaper
    }
  } catch (error) {
    console.error('Error saving paper:', error)
  } finally {
    isSaving.value = false
  }
}

// Navigate back
function navigateBack() {
  router.push('/projects')
}

// Toggle reference sidebar
function toggleReferenceSidebar() {
  showReferenceSidebar.value = !showReferenceSidebar.value
}

// Select reference
function selectReference(id) {
  selectedReferenceId.value = id === selectedReferenceId.value ? null : id
}

// Cite reference
function citeReference(reference) {
  if (editor.value) {
    editor.value.chain().focus().insertContent(`<a class="citation" data-ref-id="${reference.id}">[${reference.authors.split(',')[0]} et al., ${reference.year}]</a> `).run()
    
    if (!paper.value.references.includes(reference.id)) {
      paper.value.references.push(reference.id)
      savePaper()
    }
  }
}

// Open add reference modal
function openAddReferenceModal() {
  // Implementation for adding references
  console.log('Open add reference modal')
}
</script>

<style>
.editor-content {
  min-height: 500px;
}

.ProseMirror {
  outline: none;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.citation {
  @apply text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 px-1.5 py-0.5 rounded no-underline;
}
</style>