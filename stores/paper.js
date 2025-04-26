import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

export const usePaperStore = defineStore('paper', () => {
  const config = useRuntimeConfig()
  const papers = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchPapers() {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${config.public.apiBaseUrl}/api/papers`)
      papers.value = await response.json()
    } catch (e) {
      error.value = 'Failed to fetch papers'
      console.error('Error fetching papers:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPaper(id) {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch(`${config.public.apiBaseUrl}/api/papers/${id}`)
      if (!response.ok) {
        throw new Error('Paper not found')
      }
      return await response.json()
    } catch (e) {
      error.value = 'Failed to fetch paper'
      console.error('Error fetching paper:', e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function savePaper(paper) {
    isLoading.value = true
    error.value = null
    try {
      const url = paper.id === 'new' 
        ? `${config.public.apiBaseUrl}/api/papers`
        : `${config.public.apiBaseUrl}/api/papers/${paper.id}`
      
      const response = await fetch(url, {
        method: paper.id === 'new' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paper),
      })
      
      const savedPaper = await response.json()
      
      // Update local papers list
      const index = papers.value.findIndex(p => p.id === savedPaper.id)
      if (index !== -1) {
        papers.value[index] = savedPaper
      } else {
        papers.value.push(savedPaper)
      }
      
      return savedPaper
    } catch (e) {
      error.value = 'Failed to save paper'
      console.error('Error saving paper:', e)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function deletePaper(id) {
    isLoading.value = true
    error.value = null
    try {
      await fetch(`${config.public.apiBaseUrl}/api/papers/${id}`, {
        method: 'DELETE',
      })
      papers.value = papers.value.filter(paper => paper.id !== id)
      return true
    } catch (e) {
      error.value = 'Failed to delete paper'
      console.error('Error deleting paper:', e)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    papers,
    isLoading,
    error,
    fetchPapers,
    fetchPaper,
    savePaper,
    deletePaper
  }
})