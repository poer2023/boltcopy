<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold">My Papers</h1>
      <UButton
        icon="i-mdi-plus"
        color="primary"
        to="/editor/new"
      >
        New Paper
      </UButton>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
      <UInput
        v-model="searchQuery"
        placeholder="Search papers..."
        icon="i-mdi-magnify"
        class="mb-4"
      />
      
      <UTable
        :columns="columns"
        :rows="filteredPapers"
        :loading="isLoading"
        :empty-state="{ icon: 'i-mdi-file-document', label: 'No papers found' }"
      >
        <template #title-data="{ row }">
          <div class="font-medium">{{ row.title }}</div>
        </template>
        
        <template #updated-data="{ row }">
          <div>{{ formatDate(row.updatedAt) }}</div>
        </template>
        
        <template #actions-data="{ row }">
          <div class="flex items-center gap-2">
            <UButton
              icon="i-mdi-pencil"
              color="primary"
              variant="ghost"
              size="sm"
              :to="`/editor/${row.id}`"
            />
            <UButton
              icon="i-mdi-content-duplicate"
              color="gray"
              variant="ghost"
              size="sm"
              @click="duplicatePaper(row)"
            />
            <UButton
              icon="i-mdi-delete"
              color="red"
              variant="ghost"
              size="sm"
              @click="confirmDeletePaper(row)"
            />
          </div>
        </template>
      </UTable>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
      
      <div v-if="recentActivity.length" class="space-y-4">
        <div
          v-for="(activity, index) in recentActivity"
          :key="index"
          class="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center"
            :class="getActivityIconClass(activity.type)"
          >
            <UIcon :name="getActivityIcon(activity.type)" class="text-white" />
          </div>
          <div>
            <div class="font-medium">{{ activity.title }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">{{ activity.description }}</div>
            <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatDate(activity.timestamp) }}</div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-4">
        <p class="text-gray-500 dark:text-gray-400">No recent activity</p>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-4">Delete Paper</h3>
        <p class="mb-4">Are you sure you want to delete "{{ paperToDelete?.title }}"? This action cannot be undone.</p>
        
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
            variant="soft"
            @click="showDeleteModal = false"
          >
            Cancel
          </UButton>
          <UButton
            color="red"
            @click="deletePaper"
          >
            Delete
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePaperStore } from '~/stores/paper'

const paperStore = usePaperStore()
const isLoading = ref(true)
const searchQuery = ref('')
const showDeleteModal = ref(false)
const paperToDelete = ref(null)

// Column configuration for papers table
const columns = [
  {
    key: 'title',
    label: 'Title'
  },
  {
    key: 'updated',
    label: 'Last Updated'
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false
  }
]

// Filter papers based on search query
const filteredPapers = computed(() => {
  if (!searchQuery.value) {
    return paperStore.papers
  }
  
  const query = searchQuery.value.toLowerCase()
  return paperStore.papers.filter(paper => 
    paper.title.toLowerCase().includes(query)
  )
})

// Recent activity
const recentActivity = ref([])

// Load papers and activity data
onMounted(async () => {
  await paperStore.fetchPapers()
  isLoading.value = false
  
  // Simulate recent activity data
  recentActivity.value = [
    {
      type: 'edit',
      title: 'Edited "Impact of AI on Education"',
      description: 'You updated the introduction section',
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      type: 'reference',
      title: 'Added 3 new references',
      description: 'To "Quantum Computing Applications"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    },
    {
      type: 'create',
      title: 'Created new paper',
      description: '"Machine Learning in Healthcare"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
    },
    {
      type: 'export',
      title: 'Exported paper as PDF',
      description: '"Neural Networks: A Comprehensive Study"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
    }
  ]
})

// Format date
function formatDate(date) {
  if (!date) return ''
  
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  if (diff < 1000 * 60) {
    return 'Just now'
  } else if (diff < 1000 * 60 * 60) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  } else if (diff < 1000 * 60 * 60 * 24) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else if (diff < 1000 * 60 * 60 * 24 * 7) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return `${days} day${days === 1 ? '' : 's'} ago`
  } else {
    return d.toLocaleDateString()
  }
}

// Get activity icon
function getActivityIcon(type) {
  switch (type) {
    case 'edit': return 'i-mdi-pencil'
    case 'reference': return 'i-mdi-bookmark'
    case 'create': return 'i-mdi-file-plus'
    case 'export': return 'i-mdi-export'
    default: return 'i-mdi-information'
  }
}

// Get activity icon class
function getActivityIconClass(type) {
  switch (type) {
    case 'edit': return 'bg-blue-500'
    case 'reference': return 'bg-green-500'
    case 'create': return 'bg-purple-500'
    case 'export': return 'bg-orange-500'
    default: return 'bg-gray-500'
  }
}

// Confirm paper deletion
function confirmDeletePaper(paper) {
  paperToDelete.value = paper
  showDeleteModal.value = true
}

// Delete paper
async function deletePaper() {
  if (!paperToDelete.value) return
  
  await paperStore.deletePaper(paperToDelete.value.id)
  showDeleteModal.value = false
  paperToDelete.value = null
}

// Duplicate paper
async function duplicatePaper(paper) {
  const duplicate = {
    ...paper,
    id: 'new',
    title: `${paper.title} (Copy)`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  await paperStore.savePaper(duplicate)
}
</script>