<template>
  <div class="flex items-center flex-wrap gap-1">
    <div class="flex items-center">
      <UButton
        icon="i-mdi-format-bold"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      />
      <UButton
        icon="i-mdi-format-italic"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      />
      <UButton
        icon="i-mdi-format-underline"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('underline') }"
        @click="editor.chain().focus().toggleUnderline().run()"
      />
      <UButton
        icon="i-mdi-format-strikethrough"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      />
      <UButton
        icon="i-mdi-format-highlight"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('highlight') }"
        @click="editor.chain().focus().toggleHighlight().run()"
      />
    </div>
    
    <UDivider vertical />
    
    <div class="flex items-center">
      <UButton
        icon="i-mdi-format-header-1"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      />
      <UButton
        icon="i-mdi-format-header-2"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      />
      <UButton
        icon="i-mdi-format-header-3"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      />
    </div>
    
    <UDivider vertical />
    
    <div class="flex items-center">
      <UButton
        icon="i-mdi-format-list-bulleted"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      />
      <UButton
        icon="i-mdi-format-list-numbered"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      />
      <UButton
        icon="i-mdi-format-quote-close"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      />
    </div>
    
    <UDivider vertical />
    
    <div class="flex items-center">
      <UButton
        icon="i-mdi-code-tags"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      />
      <UButton
        icon="i-mdi-table"
        color="gray"
        variant="ghost"
        size="sm"
        @click="insertTable"
      />
      <UButton
        icon="i-mdi-link"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('link') }"
        @click="setLink"
      />
    </div>
    
    <UDivider vertical />
    
    <div class="flex items-center">
      <UButton
        icon="i-mdi-format-align-left"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive({ textAlign: 'left' }) }"
        @click="editor.chain().focus().setTextAlign('left').run()"
      />
      <UButton
        icon="i-mdi-format-align-center"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive({ textAlign: 'center' }) }"
        @click="editor.chain().focus().setTextAlign('center').run()"
      />
      <UButton
        icon="i-mdi-format-align-right"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive({ textAlign: 'right' }) }"
        @click="editor.chain().focus().setTextAlign('right').run()"
      />
      <UButton
        icon="i-mdi-format-align-justify"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive({ textAlign: 'justify' }) }"
        @click="editor.chain().focus().setTextAlign('justify').run()"
      />
    </div>
    
    <UDivider vertical />
    
    <div class="flex items-center">
      <UButton
        icon="i-mdi-format-subscript"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('subscript') }"
        @click="editor.chain().focus().toggleSubscript().run()"
      />
      <UButton
        icon="i-mdi-format-superscript"
        color="gray"
        variant="ghost"
        size="sm"
        :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('superscript') }"
        @click="editor.chain().focus().toggleSuperscript().run()"
      />
    </div>
    
    <div class="ml-auto flex items-center">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ editor.storage?.characterCount?.words?.() ?? 0 }} words
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

function setLink() {
  const previousUrl = props.editor.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)
  
  // cancelled
  if (url === null) {
    return
  }
  
  // empty
  if (url === '') {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  
  // update link
  props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function insertTable() {
  props.editor.chain().focus()
    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
    .run()
}
</script>