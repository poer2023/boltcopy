<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
            {{ languageStore.t('hero.title') }}
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300">
            {{ languageStore.t('hero.subtitle') }}
          </p>
        </div>

        <!-- Main Interaction Area -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div v-if="!isStarted" class="text-center py-12">
            <p class="text-lg mb-8">{{ languageStore.t('hero.prompt') }}</p>
            <div class="grid md:grid-cols-2 gap-4 max-w-xl mx-auto">
              <button
                v-for="option in startOptions"
                :key="option.id"
                class="flex flex-col items-center p-6 rounded-lg border-2 border-transparent hover:border-primary-500 bg-gray-50 dark:bg-gray-900 transition-all"
                @click="startWriting(option)"
              >
                <UIcon 
                  :name="option.icon"
                  class="text-4xl text-primary-600 dark:text-primary-400 mb-3"
                />
                <h3 class="font-medium mb-2">{{ languageStore.t(`writingTypes.${option.id}.title`) }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ languageStore.t(`writingTypes.${option.id}.description`) }}
                </p>
              </button>
            </div>
          </div>

          <div v-else class="space-y-6">
            <!-- Conversation Flow -->
            <div class="space-y-4">
              <div
                v-for="(message, index) in conversation"
                :key="index"
                :class="[
                  'p-4 rounded-lg max-w-[80%]',
                  message.type === 'ai' 
                    ? 'bg-purple-50 dark:bg-purple-900/30 ml-0' 
                    : 'bg-blue-50 dark:bg-blue-900/30 ml-auto'
                ]"
              >
                <p>{{ message.text }}</p>
              </div>
            </div>

            <!-- Current Input -->
            <div v-if="currentStep" class="border-t dark:border-gray-700 pt-4">
              <p class="text-lg mb-4">{{ currentStep.prompt }}</p>
              
              <div v-if="currentStep.type === 'text'" class="mb-4">
                <UTextarea
                  v-model="currentInput"
                  :placeholder="currentStep.placeholder"
                  class="mb-2"
                  rows="3"
                />
              </div>

              <div v-else-if="currentStep.type === 'choice'" class="mb-4">
                <div class="grid gap-2">
                  <UButton
                    v-for="choice in currentStep.choices"
                    :key="choice.value"
                    :color="currentInput === choice.value ? 'primary' : 'gray'"
                    variant="soft"
                    block
                    @click="currentInput = choice.value"
                  >
                    {{ choice.label }}
                  </UButton>
                </div>
              </div>

              <div class="flex justify-between">
                <UButton
                  v-if="canGoBack"
                  color="gray"
                  variant="soft"
                  @click="goBack"
                >
                  {{ languageStore.currentLanguage === 'en' ? 'Back' : '返回' }}
                </UButton>
                <UButton
                  color="primary"
                  :disabled="!canContinue"
                  :loading="isProcessing"
                  class="ml-auto"
                  @click="nextStep"
                >
                  {{ currentStep.isLast 
                    ? (languageStore.currentLanguage === 'en' ? 'Start Writing' : '开始写作')
                    : (languageStore.currentLanguage === 'en' ? 'Continue' : '继续')
                  }}
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Features -->
        <div class="grid md:grid-cols-3 gap-6">
          <div
            v-for="feature in aiFeatures"
            :key="feature.id"
            class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
          >
            <UIcon 
              :name="feature.icon"
              class="text-3xl text-primary-600 dark:text-primary-400 mb-3"
            />
            <h3 class="font-medium mb-2">{{ languageStore.t(`features.${feature.id}.title`) }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ languageStore.t(`features.${feature.id}.description`) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '~/stores/language'

const router = useRouter()
const languageStore = useLanguageStore()
const isStarted = ref(false)
const isProcessing = ref(false)
const currentInput = ref('')
const currentStepIndex = ref(0)
const conversation = ref([])
const writingType = ref(null)

const startOptions = [
  {
    id: 'freeform',
    icon: 'i-mdi-pencil-outline'
  },
  {
    id: 'structured',
    icon: 'i-mdi-file-tree'
  },
  {
    id: 'collaborative',
    icon: 'i-mdi-account-group'
  },
  {
    id: 'academic',
    icon: 'i-mdi-school'
  }
]

const aiFeatures = [
  {
    id: 'understanding',
    icon: 'i-mdi-brain'
  },
  {
    id: 'suggestions',
    icon: 'i-mdi-lightbulb'
  },
  {
    id: 'enhancement',
    icon: 'i-mdi-magic'
  }
]

const writingSteps = {
  freeform: [
    {
      type: 'text',
      prompt: languageStore.t('writingTypes.freeform.prompt'),
      placeholder: languageStore.t('writingTypes.freeform.placeholder'),
      required: true
    },
    {
      type: 'choice',
      prompt: languageStore.t('writingTypes.freeform.tonePrompt'),
      choices: [
        { label: languageStore.t('writingTypes.freeform.tones.professional'), value: 'professional' },
        { label: languageStore.t('writingTypes.freeform.tones.casual'), value: 'casual' },
        { label: languageStore.t('writingTypes.freeform.tones.academic'), value: 'academic' },
        { label: languageStore.t('writingTypes.freeform.tones.creative'), value: 'creative' }
      ],
      required: true
    },
    {
      type: 'text',
      prompt: languageStore.t('writingTypes.freeform.pointsPrompt'),
      placeholder: languageStore.t('writingTypes.freeform.pointsPlaceholder'),
      required: false,
      isLast: true
    }
  ],
  structured: [
    {
      type: 'choice',
      prompt: languageStore.t('writingTypes.structured.typePrompt'),
      choices: [
        { label: languageStore.t('writingTypes.structured.types.blog'), value: 'blog' },
        { label: languageStore.t('writingTypes.structured.types.article'), value: 'article' },
        { label: languageStore.t('writingTypes.structured.types.report'), value: 'report' },
        { label: languageStore.t('writingTypes.structured.types.docs'), value: 'docs' }
      ],
      required: true
    },
    {
      type: 'text',
      prompt: languageStore.t('writingTypes.structured.topicPrompt'),
      placeholder: languageStore.t('writingTypes.structured.topicPlaceholder'),
      required: true,
      isLast: true
    }
  ],
  collaborative: [
    {
      type: 'text',
      prompt: languageStore.t('writingTypes.collaborative.projectPrompt'),
      placeholder: languageStore.t('writingTypes.collaborative.projectPlaceholder'),
      required: true
    },
    {
      type: 'choice',
      prompt: languageStore.t('writingTypes.collaborative.helpPrompt'),
      choices: [
        { label: languageStore.t('writingTypes.collaborative.helpTypes.ideation'), value: 'ideation' },
        { label: languageStore.t('writingTypes.collaborative.helpTypes.expansion'), value: 'expansion' },
        { label: languageStore.t('writingTypes.collaborative.helpTypes.review'), value: 'review' },
        { label: languageStore.t('writingTypes.collaborative.helpTypes.research'), value: 'research' }
      ],
      required: true,
      isLast: true
    }
  ],
  academic: [
    {
      type: 'text',
      prompt: languageStore.t('writingTypes.academic.topicPrompt'),
      placeholder: languageStore.t('writingTypes.academic.topicPlaceholder'),
      required: true
    },
    {
      type: 'choice',
      prompt: languageStore.t('writingTypes.academic.typePrompt'),
      choices: [
        { label: languageStore.t('writingTypes.academic.types.research'), value: 'research' },
        { label: languageStore.t('writingTypes.academic.types.review'), value: 'review' },
        { label: languageStore.t('writingTypes.academic.types.caseStudy'), value: 'case-study' },
        { label: languageStore.t('writingTypes.academic.types.thesis'), value: 'thesis' }
      ],
      required: true,
      isLast: true
    }
  ]
}

const currentStep = computed(() => {
  if (!writingType.value) return null
  return writingSteps[writingType.value][currentStepIndex.value]
})

const canGoBack = computed(() => currentStepIndex.value > 0)

const canContinue = computed(() => {
  if (!currentStep.value) return false
  return !currentStep.value.required || currentInput.value.trim().length > 0
})

function startWriting(option) {
  isStarted.value = true
  writingType.value = option.id
  conversation.value.push({
    type: 'ai',
    text: languageStore.t(`writingTypes.${option.id}.startMessage`)
  })
}

function addToConversation(input, isAi = false) {
  conversation.value.push({
    type: isAi ? 'ai' : 'user',
    text: input
  })
}

async function nextStep() {
  if (!currentStep.value) return

  isProcessing.value = true
  
  try {
    addToConversation(
      currentStep.value.type === 'choice' 
        ? currentStep.value.choices.find(c => c.value === currentInput.value)?.label 
        : currentInput.value
    )

    if (currentStep.value.isLast) {
      addToConversation(languageStore.t('writingTypes.common.startingMessage'), true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      router.push('/editor/new')
      return
    }

    currentStepIndex.value++
    addToConversation(currentStep.value.prompt, true)
    currentInput.value = ''
  } finally {
    isProcessing.value = false
  }
}

function goBack() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
    conversation.value = conversation.value.slice(0, -2)
    currentInput.value = ''
  }
}
</script>