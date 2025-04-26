<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Reference Library -->
      <div class="w-full md:w-2/3">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold">Reference Library</h1>
          <UButton
            icon="i-mdi-plus"
            color="primary"
            @click="openAddReferenceModal"
          >
            Add Reference
          </UButton>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <UInput
              v-model="searchQuery"
              placeholder="Search references..."
              icon="i-mdi-magnify"
              class="flex-1"
            />
            
            <USelectMenu
              v-model="selectedTypes"
              :options="referenceTypes"
              placeholder="Filter by type"
              multiple
              class="w-full md:w-64"
            />
          </div>
          
          <div class="flex gap-2 mb-6 flex-wrap">
            <UBadge
              v-for="tag in availableTags"
              :key="tag"
              :color="selectedTags.includes(tag) ? 'primary' : 'gray'"
              variant="soft"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </UBadge>
          </div>
          
          <div v-if="filteredReferences.length" class="space-y-4">
            <ReferenceCard
              v-for="reference in filteredReferences"
              :key="reference.id"
              :reference="reference"
              :active="selectedReference?.id === reference.id"
              @click="selectReference(reference)"
              @edit="editReference(reference)"
              @delete="confirmDeleteReference(reference)"
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
      
      <!-- Reference Details -->
      <div class="w-full md:w-1/3">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
          <h2 class="text-lg font-semibold mb-4">Reference Details</h2>
          
          <div v-if="selectedReference" class="space-y-4">
            <div>
              <h3 class="text-xl font-medium mb-2">{{ selectedReference.title }}</h3>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <UIcon name="i-mdi-account" class="inline-block mr-1" />
                {{ selectedReference.authors }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <UIcon name="i-mdi-calendar" class="inline-block mr-1" />
                {{ selectedReference.year }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <UIcon name="i-mdi-book-open" class="inline-block mr-1" />
                {{ selectedReference.source }}
              </div>
              <div v-if="selectedReference.url" class="text-sm text-primary-600 dark:text-primary-400 mb-1">
                <UIcon name="i-mdi-link" class="inline-block mr-1" />
                <a :href="selectedReference.url" target="_blank" rel="noopener">View source</a>
              </div>
              <div v-if="selectedReference.doi" class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                <UIcon name="i-mdi-barcode" class="inline-block mr-1" />
                DOI: {{ selectedReference.doi }}
              </div>
            </div>
            
            <UDivider />
            
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium">Citation Formats</h4>
                <UButton
                  icon="i-mdi-content-copy"
                  color="gray"
                  variant="ghost"
                  size="xs"
                  @click="copyCitation"
                >
                  Copy
                </UButton>
              </div>
              
              <USelectMenu
                v-model="selectedCitationStyle"
                :options="citationStyles"
                placeholder="Select citation style"
                class="mb-3"
              />
              
              <div class="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm font-mono">
                {{ formattedCitation }}
              </div>
            </div>
            
            <UDivider />
            
            <div>
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium">Notes</h4>
                <UButton
                  icon="i-mdi-pencil"
                  color="gray"
                  variant="ghost"
                  size="xs"
                  @click="editNotes"
                >
                  Edit
                </UButton>
              </div>
              
              <div v-if="!isEditingNotes" class="bg-gray-50 dark:bg-gray-900 p-3 rounded-md text-sm">
                {{ selectedReference.notes || 'No notes added yet.' }}
              </div>
              
              <div v-else>
                <UTextarea
                  v-model="editedNotes"
                  placeholder="Add your notes about this reference..."
                  rows="5"
                  class="mb-2"
                />
                <div class="flex justify-end gap-2">
                  <UButton
                    color="gray"
                    variant="soft"
                    size="sm"
                    @click="cancelEditNotes"
                  >
                    Cancel
                  </UButton>
                  <UButton
                    color="primary"
                    size="sm"
                    @click="saveNotes"
                  >
                    Save
                  </UButton>
                </div>
              </div>
            </div>
            
            <UDivider />
            
            <div>
              <h4 class="font-medium mb-2">Used in Papers</h4>
              <div v-if="referencePapers.length" class="space-y-2">
                <div
                  v-for="paper in referencePapers"
                  :key="paper.id"
                  class="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span class="text-sm">{{ paper.title }}</span>
                  <UButton
                    icon="i-mdi-open-in-new"
                    color="primary"
                    variant="ghost"
                    size="xs"
                    :to="`/editor/${paper.id}`"
                  />
                </div>
              </div>
              <div v-else class="text-sm text-gray-500 dark:text-gray-400">
                Not used in any papers yet.
              </div>
            </div>
            
            <div class="flex justify-between mt-4">
              <UButton
                icon="i-mdi-pencil"
                color="primary"
                @click="editReference(selectedReference)"
              >
                Edit
              </UButton>
              <UButton
                icon="i-mdi-delete"
                color="red"
                variant="soft"
                @click="confirmDeleteReference(selectedReference)"
              >
                Delete
              </UButton>
            </div>
          </div>
          
          <div v-else class="text-center py-8">
            <p class="text-gray-500 dark:text-gray-400 mb-4">Select a reference to view details</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Reference Modal -->
    <UModal v-model="showReferenceModal">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ isEditMode ? 'Edit Reference' : 'Add Reference' }}
        </h3>
        
        <UTabs :items="referenceTabItems">
          <template #manual="{ item }">
            <div class="space-y-4">
              <UFormGroup label="Reference Type">
                <USelect
                  v-model="referenceForm.type"
                  :options="referenceTypeOptions"
                  placeholder="Select reference type"
                />
              </UFormGroup>
              
              <UFormGroup label="Title">
                <UInput v-model="referenceForm.title" placeholder="Title of the work" />
              </UFormGroup>
              
              <UFormGroup label="Authors">
                <UInput v-model="referenceForm.authors" placeholder="Authors (comma separated)" />
              </UFormGroup>
              
              <UFormGroup label="Year">
                <UInput v-model="referenceForm.year" placeholder="Publication year" />
              </UFormGroup>
              
              <UFormGroup label="Source">
                <UInput v-model="referenceForm.source" placeholder="Journal, book, website, etc." />
              </UFormGroup>
              
              <UFormGroup label="URL (Optional)">
                <UInput v-model="referenceForm.url" placeholder="Link to the resource" />
              </UFormGroup>
              
              <UFormGroup label="DOI (Optional)">
                <UInput v-model="referenceForm.doi" placeholder="Digital Object Identifier" />
              </UFormGroup>
              
              <UFormGroup label="Tags">
                <div class="flex flex-wrap gap-2 mb-2">
                  <UBadge
                    v-for="tag in referenceForm.tags"
                    :key="tag"
                    color="primary"
                    variant="soft"
                    @click="removeTag(tag)"
                  >
                    {{ tag }}
                    <UIcon name="i-mdi-close" class="ml-1" />
                  </UBadge>
                </div>
                <UInputGroup>
                  <UInput v-model="newTag" placeholder="Add tags..." />
                  <UButton
                    icon="i-mdi-plus"
                    @click="addTag"
                    :disabled="!newTag"
                  />
                </UInputGroup>
              </UFormGroup>
              
              <UFormGroup label="Notes">
                <UTextarea v-model="referenceForm.notes" placeholder="Your notes about this reference" rows="3" />
              </UFormGroup>
              
              <div class="flex justify-end gap-2">
                <UButton
                  color="gray"
                  variant="soft"
                  @click="showReferenceModal = false"
                >
                  Cancel
                </UButton>
                <UButton
                  color="primary"
                  @click="saveReference"
                >
                  {{ isEditMode ? 'Update' : 'Add' }} Reference
                </UButton>
              </div>
            </div>
          </template>
          
          <template #doi="{ item }">
            <div class="space-y-4">
              <UFormGroup label="DOI">
                <UInput v-model="doiInput" placeholder="Enter DOI (e.g., 10.1000/xyz123)" />
              </UFormGroup>
              
              <UButton
                color="primary"
                icon="i-mdi-magnify"
                block
                :loading="isLoadingDOI"
                @click="fetchByDOI"
              >
                Fetch Reference
              </UButton>
              
              <div v-if="doiPreview" class="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h4 class="font-medium mb-2">{{ doiPreview.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">{{ doiPreview.authors }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-300">{{ doiPreview.source }} ({{ doiPreview.year }})</p>
                
                <div class="mt-4 flex justify-end">
                  <UButton
                    color="primary"
                    @click="addDOIReference"
                  >
                    Add This Reference
                  </UButton>
                </div>
              </div>
            </div>
          </template>
          
          <template #search="{ item }">
            <div class="space-y-4">
              <UFormGroup>
                <UInput
                  v-model="searchReferenceQuery"
                  placeholder="Search for articles, books, papers..."
                  icon="i-mdi-magnify"
                />
              </UFormGroup>
              
              <UButton
                color="primary"
                block
                :loading="isSearchingReferences"
                @click="searchExternalReferences"
              >
                Search
              </UButton>
              
              <div v-if="searchResults.length" class="space-y-3">
                <div
                  v-for="(result, index) in searchResults"
                  :key="index"
                  class="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <h4 class="font-medium mb-1">{{ result.title }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">{{ result.authors }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ result.source }} ({{ result.year }})</p>
                  
                  <div class="mt-2 flex justify-end">
                    <UButton
                      size="sm"
                      color="primary"
                      @click="addSearchResult(result)"
                    >
                      Add
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <template #import="{ item }">
            <div class="space-y-4">
              <UFormGroup label="Import Format">
                <USelect
                  v-model="importFormat"
                  :options="importFormatOptions"
                  placeholder="Select import format"
                />
              </UFormGroup>
              
              <UFormGroup label="Import Data">
                <UTextarea
                  v-model="importData"
                  placeholder="Paste BibTeX, RIS, or other reference data here..."
                  rows="8"
                />
              </UFormGroup>
              
              <UButton
                color="primary"
                icon="i-mdi-database-import"
                block
                :loading="isImporting"
                @click="importReferences"
              >
                Import References
              </UButton>
            </div>
          </template>
        </UTabs>
      </div>
    </UModal>
    
    <!-- Delete Confirmation Modal -->
    <UModal v-model="showDeleteModal">
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-4">Delete Reference</h3>
        <p class="mb-4">Are you sure you want to delete "{{ referenceToDelete?.title }}"? This may affect papers that cite this reference.</p>
        
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
            @click="deleteReference"
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
import { useReferenceStore } from '~/stores/reference'
import { usePaperStore } from '~/stores/paper'

const referenceStore = useReferenceStore()
const paperStore = usePaperStore()

// Search and filter state
const searchQuery = ref('')
const selectedTypes = ref([])
const selectedTags = ref([])

// Reference details state
const selectedReference = ref(null)
const selectedCitationStyle = ref('apa')
const isEditingNotes = ref(false)
const editedNotes = ref('')

// Modal state
const showReferenceModal = ref(false)
const isEditMode = ref(false)
const showDeleteModal = ref(false)
const referenceToDelete = ref(null)

// Reference form
const referenceForm = ref({
  id: '',
  type: 'article',
  title: '',
  authors: '',
  year: '',
  source: '',
  url: '',
  doi: '',
  tags: [],
  notes: ''
})

// Tags
const newTag = ref('')

// DOI lookup
const doiInput = ref('')
const isLoadingDOI = ref(false)
const doiPreview = ref(null)

// Reference search
const searchReferenceQuery = ref('')
const isSearchingReferences = ref(false)
const searchResults = ref([])

// Import
const importFormat = ref('bibtex')
const importData = ref('')
const isImporting = ref(false)

// Load references
onMounted(async () => {
  await referenceStore.fetchReferences()
  await paperStore.fetchPapers()
  
  // Select first reference if available
  if (referenceStore.references.length > 0) {
    selectedReference.value = referenceStore.references[0]
  }
})

// Reference types for dropdown
const referenceTypeOptions = [
  { label: 'Article', value: 'article' },
  { label: 'Book', value: 'book' },
  { label: 'Website', value: 'website' },
  { label: 'Conference Paper', value: 'conference' },
  { label: 'Thesis', value: 'thesis' },
  { label: 'Report', value: 'report' },
  { label: 'Other', value: 'other' }
]

// Reference types for filter
const referenceTypes = [
  { label: 'Articles', value: 'article' },
  { label: 'Books', value: 'book' },
  { label: 'Websites', value: 'website' },
  { label: 'Conference Papers', value: 'conference' },
  { label: 'Theses', value: 'thesis' },
  { label: 'Reports', value: 'report' },
  { label: 'Other', value: 'other' }
]

// Citation styles
const citationStyles = [
  { label: 'APA', value: 'apa' },
  { label: 'MLA', value: 'mla' },
  { label: 'Chicago', value: 'chicago' },
  { label: 'Harvard', value: 'harvard' },
  { label: 'IEEE', value: 'ieee' }
]

// Import formats
const importFormatOptions = [
  { label: 'BibTeX', value: 'bibtex' },
  { label: 'RIS', value: 'ris' },
  { label: 'CSV', value: 'csv' }
]

// Reference tab items
const referenceTabItems = [
  { id: 'manual', label: 'Manual Entry', icon: 'i-mdi-pencil' },
  { id: 'doi', label: 'DOI Lookup', icon: 'i-mdi-barcode' },
  { id: 'search', label: 'Search', icon: 'i-mdi-magnify' },
  { id: 'import', label: 'Import', icon: 'i-mdi-database-import' }
]

// All available tags across references
const availableTags = computed(() => {
  const tags = new Set()
  referenceStore.references.forEach(ref => {
    if (ref.tags) {
      ref.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags)
})

// Filtered references
const filteredReferences = computed(() => {
  let refs = referenceStore.references
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    refs = refs.filter(ref => 
      ref.title.toLowerCase().includes(query) || 
      ref.authors.toLowerCase().includes(query) ||
      ref.source.toLowerCase().includes(query)
    )
  }
  
  // Filter by type
  if (selectedTypes.value.length) {
    refs = refs.filter(ref => selectedTypes.value.includes(ref.type))
  }
  
  // Filter by tags
  if (selectedTags.value.length) {
    refs = refs.filter(ref => 
      ref.tags && selectedTags.value.every(tag => ref.tags.includes(tag))
    )
  }
  
  return refs
})

// Formatted citation
const formattedCitation = computed(() => {
  if (!selectedReference.value) return ''
  
  const ref = selectedReference.value
  let citation = ''
  
  switch (selectedCitationStyle.value) {
    case 'apa':
      // APA: Author, A. A. (Year). Title. Source.
      citation = `${formatAuthorsAPA(ref.authors)}. (${ref.year}). ${ref.title}. ${ref.source}.`
      break
    case 'mla':
      // MLA: Author. "Title." Source, Year.
      citation = `${formatAuthorsMLA(ref.authors)}. "${ref.title}." ${ref.source}, ${ref.year}.`
      break
    case 'chicago':
      // Chicago: Author. Title. Source (Year).
      citation = `${formatAuthorsChicago(ref.authors)}. ${ref.title}. ${ref.source} (${ref.year}).`
      break
    case 'harvard':
      // Harvard: Author (Year). Title. Source.
      citation = `${formatAuthorsHarvard(ref.authors)} (${ref.year}). ${ref.title}. ${ref.source}.`
      break
    case 'ieee':
      // IEEE: [1] A. Author, "Title," Source, Year.
      citation = `[1] ${formatAuthorsIEEE(ref.authors)}, "${ref.title}," ${ref.source}, ${ref.year}.`
      break
    default:
      citation = `${ref.authors}. (${ref.year}). ${ref.title}. ${ref.source}.`
  }
  
  return citation
})

// Papers using this reference
const referencePapers = computed(() => {
  if (!selectedReference.value) return []
  
  return paperStore.papers.filter(paper => 
    paper.references && paper.references.includes(selectedReference.value.id)
  )
})

// Format authors for different citation styles
function formatAuthorsAPA(authors) {
  if (!authors) return ''
  
  const authorList = authors.split(',').map(a => a.trim())
  if (authorList.length === 1) {
    const parts = authorList[0].split(' ')
    const lastName = parts.pop()
    const firstNames = parts.map(name => name.charAt(0) + '.').join(' ')
    return `${lastName}, ${firstNames}`
  } else if (authorList.length === 2) {
    return `${formatAuthorAPA(authorList[0])} & ${formatAuthorAPA(authorList[1])}`
  } else if (authorList.length > 2) {
    return `${formatAuthorAPA(authorList[0])} et al.`
  }
  return authors
}

function formatAuthorAPA(author) {
  const parts = author.split(' ')
  const lastName = parts.pop()
  const firstNames = parts.map(name => name.charAt(0) + '.').join(' ')
  return `${lastName}, ${firstNames}`
}

function formatAuthorsMLA(authors) {
  if (!authors) return ''
  
  const authorList = authors.split(',').map(a => a.trim())
  if (authorList.length === 1) {
    return authorList[0]
  } else if (authorList.length === 2) {
    return `${authorList[0]} and ${authorList[1]}`
  } else if (authorList.length > 2) {
    return `${authorList[0]} et al.`
  }
  return authors
}

function formatAuthorsChicago(authors) {
  if (!authors) return ''
  
  const authorList = authors.split(',').map(a => a.trim())
  if (authorList.length === 1) {
    return authorList[0]
  } else if (authorList.length === 2) {
    return `${authorList[0]} and ${authorList[1]}`
  } else if (authorList.length > 2) {
    return `${authorList[0]} et al.`
  }
  return authors
}

function formatAuthorsHarvard(authors) {
  if (!authors) return ''
  
  const authorList = authors.split(',').map(a => a.trim())
  if (authorList.length === 1) {
    return authorList[0]
  } else if (authorList.length === 2) {
    return `${authorList[0]} and ${authorList[1]}`
  } else if (authorList.length > 2) {
    return `${authorList[0]} et al.`
  }
  return authors
}

function formatAuthorsIEEE(authors) {
  if (!authors) return ''
  
  const authorList = authors.split(',').map(a => a.trim())
  if (authorList.length === 1) {
    const parts = authorList[0].split(' ')
    const lastName = parts.pop()
    const firstNames = parts.map(name => name.charAt(0) + '.').join(' ')
    return `${firstNames} ${lastName}`
  } else if (authorList.length > 1) {
    const formattedAuthors = authorList.map(author => {
      const parts = author.split(' ')
      const lastName = parts.pop()
      const firstNames = parts.map(name => name.charAt(0) + '.').join(' ')
      return `${firstNames} ${lastName}`
    })
    return formattedAuthors.join(', ')
  }
  return authors
}

// Select reference
function selectReference(reference) {
  selectedReference.value = reference
}

// Toggle tag filter
function toggleTag(tag) {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

// Add tag to reference form
function addTag() {
  if (!newTag.value || referenceForm.value.tags.includes(newTag.value)) {
    return
  }
  
  referenceForm.value.tags.push(newTag.value)
  newTag.value = ''
}

// Remove tag from reference form
function removeTag(tag) {
  const index = referenceForm.value.tags.indexOf(tag)
  if (index !== -1) {
    referenceForm.value.tags.splice(index, 1)
  }
}

// Copy citation
function copyCitation() {
  navigator.clipboard.writeText(formattedCitation.value)
    .then(() => {
      // Show a notification or some feedback that it was copied
      console.log('Citation copied')
    })
    .catch(err => {
      console.error('Failed to copy citation:', err)
    })
}

// Edit notes
function editNotes() {
  if (!selectedReference.value) return
  
  editedNotes.value = selectedReference.value.notes || ''
  isEditingNotes.value = true
}

// Cancel edit notes
function cancelEditNotes() {
  isEditingNotes.value = false
  editedNotes.value = ''
}

// Save notes
async function saveNotes() {
  if (!selectedReference.value) return
  
  const updatedReference = {
    ...selectedReference.value,
    notes: editedNotes.value
  }
  
  await referenceStore.updateReference(updatedReference)
  selectedReference.value = updatedReference
  isEditingNotes.value = false
}

// Open add reference modal
function openAddReferenceModal() {
  isEditMode.value = false
  resetReferenceForm()
  showReferenceModal.value = true
}

// Edit reference
function editReference(reference) {
  isEditMode.value = true
  referenceForm.value = { ...reference }
  showReferenceModal.value = true
}

// Reset reference form
function resetReferenceForm() {
  referenceForm.value = {
    id: '',
    type: 'article',
    title: '',
    authors: '',
    year: '',
    source: '',
    url: '',
    doi: '',
    tags: [],
    notes: ''
  }
  doiInput.value = ''
  doiPreview.value = null
  searchReferenceQuery.value = ''
  searchResults.value = []
  importData.value = ''
}

// Save reference
async function saveReference() {
  // Validation
  if (!referenceForm.value.title || !referenceForm.value.authors) {
    return
  }
  
  if (isEditMode.value) {
    await referenceStore.updateReference(referenceForm.value)
    
    // Update selected reference if it's the one being edited
    if (selectedReference.value?.id === referenceForm.value.id) {
      selectedReference.value = { ...referenceForm.value }
    }
  } else {
    const newReference = {
      ...referenceForm.value,
      id: `ref-${Date.now()}`
    }
    await referenceStore.addReference(newReference)
    
    // Select the newly added reference
    selectedReference.value = newReference
  }
  
  showReferenceModal.value = false
}

// Confirm delete reference
function confirmDeleteReference(reference) {
  referenceToDelete.value = reference
  showDeleteModal.value = true
}

// Delete reference
async function deleteReference() {
  if (!referenceToDelete.value) return
  
  await referenceStore.deleteReference(referenceToDelete.value.id)
  
  // Clear selected reference if it was deleted
  if (selectedReference.value?.id === referenceToDelete.value.id) {
    selectedReference.value = referenceStore.references[0] || null
  }
  
  showDeleteModal.value = false
  referenceToDelete.value = null
}

// Fetch reference by DOI
function fetchByDOI() {
  if (!doiInput.value) return
  
  isLoadingDOI.value = true
  
  // Simulate DOI lookup
  setTimeout(() => {
    doiPreview.value = {
      title: 'The Impact of AI on Academic Writing',
      authors: 'Johnson, M., Smith, A., Lee, K.',
      year: '2023',
      source: 'Journal of Digital Humanities',
      doi: doiInput.value,
      url: `https://doi.org/${doiInput.value}`
    }
    
    isLoadingDOI.value = false
  }, 1500)
}

// Add DOI reference
function addDOIReference() {
  if (!doiPreview.value) return
  
  referenceForm.value = {
    id: '',
    type: 'article',
    title: doiPreview.value.title,
    authors: doiPreview.value.authors,
    year: doiPreview.value.year,
    source: doiPreview.value.source,
    url: doiPreview.value.url,
    doi: doiPreview.value.doi,
    tags: [],
    notes: ''
  }
  
  // Save the reference
  saveReference()
}

// Search external references
function searchExternalReferences() {
  if (!searchReferenceQuery.value) return
  
  isSearchingReferences.value = true
  
  // Simulate search results
  setTimeout(() => {
    searchResults.value = [
      {
        title: 'Artificial Intelligence in Academic Research',
        authors: 'Williams, J., Johnson, P.',
        year: '2022',
        source: 'International Journal of Computer Science',
        type: 'article'
      },
      {
        title: 'Reference Management for Modern Scholars',
        authors: 'Brown, A., Davis, S., Wilson, T.',
        year: '2023',
        source: 'Digital Library Quarterly',
        type: 'article'
      },
      {
        title: 'The Evolution of Writing Tools in Academia',
        authors: 'Garcia, M.',
        year: '2021',
        source: 'Technology and Education Review',
        type: 'article'
      }
    ]
    
    isSearchingReferences.value = false
  }, 1500)
}

// Add search result as reference
function addSearchResult(result) {
  referenceForm.value = {
    id: '',
    type: result.type || 'article',
    title: result.title,
    authors: result.authors,
    year: result.year,
    source: result.source,
    url: '',
    doi: '',
    tags: [],
    notes: ''
  }
  
  // Save the reference
  saveReference()
}

// Import references
function importReferences() {
  if (!importData.value) return
  
  isImporting.value = true
  
  // Simulate import processing
  setTimeout(() => {
    // In a real application, this would parse the import data based on format
    // For now, just show a success message
    console.log(`Imported references from ${importFormat.value} data`)
    
    // Close modal after import
    showReferenceModal.value = false
    isImporting.value = false
    
    // Refresh references
    referenceStore.fetchReferences()
  }, 2000)
}
</script>