import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useReferenceStore = defineStore('reference', () => {
  // Store references in local storage for demo purposes
  // In a real application, this would use a backend API
  const references = useStorage('scholar-assist-references', [
    {
      id: 'ref-1',
      type: 'article',
      title: 'Artificial Intelligence and Academic Writing: A Review of Current Applications',
      authors: 'Smith, J., Johnson, M., Williams, A.',
      year: '2022',
      source: 'Journal of Digital Humanities',
      url: 'https://example.com/ai-academic-writing',
      doi: '10.1234/jdh.2022.1234',
      tags: ['AI', 'academic writing', 'digital humanities'],
      notes: 'Comprehensive review of AI applications in academic writing, with focus on reference management.'
    },
    {
      id: 'ref-2',
      type: 'book',
      title: 'The Future of Academic Publishing',
      authors: 'Brown, R.',
      year: '2021',
      source: 'Academic Press',
      url: '',
      doi: '',
      tags: ['publishing', 'digital transformation'],
      notes: 'Chapter 5 discusses integration of AI tools in the academic workflow.'
    },
    {
      id: 'ref-3',
      type: 'website',
      title: 'Reference Management Best Practices',
      authors: 'Wilson, T.',
      year: '2023',
      source: 'Academic Resources Online',
      url: 'https://academicresources.com/reference-management',
      doi: '',
      tags: ['reference management', 'best practices'],
      notes: 'Useful guide for reference management across different citation styles.'
    }
  ])
  
  // Fetch all references
  async function fetchReferences() {
    // In a real application, this would make an API call
    // For the demo, we're just returning the local storage data
    return references.value
  }
  
  // Add a new reference
  async function addReference(reference) {
    // In a real application, this would make an API call
    references.value.push(reference)
    return reference
  }
  
  // Update an existing reference
  async function updateReference(reference) {
    // In a real application, this would make an API call
    const index = references.value.findIndex(ref => ref.id === reference.id)
    
    if (index !== -1) {
      references.value[index] = reference
      return reference
    }
    
    return null
  }
  
  // Delete a reference
  async function deleteReference(id) {
    // In a real application, this would make an API call
    const index = references.value.findIndex(ref => ref.id === id)
    
    if (index !== -1) {
      references.value.splice(index, 1)
      return true
    }
    
    return false
  }
  
  return {
    references,
    fetchReferences,
    addReference,
    updateReference,
    deleteReference
  }
})