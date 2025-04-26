<template>
  <div 
    class="reference-card cursor-pointer"
    :class="{ 'active': active }"
    @click="$emit('click')"
  >
    <div class="flex justify-between">
      <UBadge
        :color="getReferenceTypeColor(reference.type)"
        variant="solid"
        class="mb-2"
      >
        {{ getReferenceTypeName(reference.type) }}
      </UBadge>
      
      <div class="flex gap-1">
        <UButton
          icon="i-mdi-pencil"
          color="gray"
          variant="ghost"
          size="xs"
          @click.stop="$emit('edit')"
        />
        <UButton
          icon="i-mdi-delete"
          color="red"
          variant="ghost"
          size="xs"
          @click.stop="$emit('delete')"
        />
      </div>
    </div>
    
    <h3 class="text-lg font-medium mb-1">{{ reference.title }}</h3>
    <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">{{ reference.authors }}</p>
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ reference.source }} ({{ reference.year }})</p>
    
    <div v-if="reference.tags && reference.tags.length" class="mt-2 flex flex-wrap gap-1">
      <UBadge
        v-for="tag in reference.tags"
        :key="tag"
        color="gray"
        variant="soft"
        size="xs"
      >
        {{ tag }}
      </UBadge>
    </div>
    
    <div class="mt-3 flex justify-end">
      <UButton
        color="primary"
        variant="soft"
        size="sm"
        @click.stop="$emit('cite', reference)"
      >
        Cite
      </UButton>
    </div>
  </div>
</template>

<script setup>
defineProps({
  reference: {
    type: Object,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click', 'cite', 'edit', 'delete'])

function getReferenceTypeName(type) {
  const types = {
    'article': 'Article',
    'book': 'Book',
    'website': 'Website',
    'conference': 'Conference',
    'thesis': 'Thesis',
    'report': 'Report',
    'other': 'Other'
  }
  
  return types[type] || 'Unknown'
}

function getReferenceTypeColor(type) {
  const colors = {
    'article': 'primary',
    'book': 'secondary',
    'website': 'yellow',
    'conference': 'purple',
    'thesis': 'green',
    'report': 'orange',
    'other': 'gray'
  }
  
  return colors[type] || 'gray'
}
</script>