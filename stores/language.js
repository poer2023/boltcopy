import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useLanguageStore = defineStore('language', () => {
  const currentLanguage = useStorage('scholar-assist-language', 'en')
  
  const translations = {
    en: {
      hero: {
        title: 'AI-Powered Writing Assistant',
        subtitle: 'Start writing with intelligent assistance',
        prompt: 'What would you like to write today?'
      },
      writingTypes: {
        freeform: {
          title: 'Free Writing',
          description: 'Start with a blank canvas and let AI guide you',
          startMessage: "Let's work on your free writing. I'll help you get started.",
          prompt: 'What would you like to write about?',
          placeholder: 'Enter your topic or main idea...',
          tonePrompt: 'What tone would you prefer?',
          tones: {
            professional: 'Professional',
            casual: 'Casual',
            academic: 'Academic',
            creative: 'Creative'
          },
          pointsPrompt: 'Any specific points you want to cover?',
          pointsPlaceholder: 'Enter key points (optional)'
        },
        structured: {
          title: 'Structured Writing',
          description: 'Use templates and outlines for organized content',
          startMessage: "Let's create structured content together.",
          typePrompt: 'Choose a content type:',
          types: {
            blog: 'Blog Post',
            article: 'Article',
            report: 'Report',
            docs: 'Documentation'
          },
          topicPrompt: "What's the main topic?",
          topicPlaceholder: 'Enter the main subject...'
        },
        collaborative: {
          title: 'Collaborative Writing',
          description: 'Write together with AI assistance',
          startMessage: "Let's collaborate on your writing project.",
          projectPrompt: 'Describe your project:',
          projectPlaceholder: 'What are you working on?',
          helpPrompt: 'How would you like AI to help?',
          helpTypes: {
            ideation: 'Generate Ideas',
            expansion: 'Expand Content',
            review: 'Review & Edit',
            research: 'Research Support'
          }
        },
        academic: {
          title: 'Academic Writing',
          description: 'Research papers and academic content',
          startMessage: "Let's work on your academic paper.",
          topicPrompt: "What's your research topic?",
          topicPlaceholder: 'Enter your research subject...',
          typePrompt: 'Select paper type:',
          types: {
            research: 'Research Paper',
            review: 'Literature Review',
            caseStudy: 'Case Study',
            thesis: 'Thesis'
          }
        },
        common: {
          startingMessage: "Great! I'll help you create your content now."
        }
      },
      features: {
        understanding: {
          title: 'Smart Understanding',
          description: 'AI understands your goals and adapts to your writing style'
        },
        suggestions: {
          title: 'Real-time Suggestions',
          description: 'Get intelligent recommendations as you write'
        },
        enhancement: {
          title: 'Auto Enhancement',
          description: 'Automatically improve clarity and readability'
        }
      },
      nav: {
        home: 'Home',
        papers: 'My Papers',
        references: 'References',
        newPaper: 'New Paper',
        help: 'Help',
        privacy: 'Privacy',
        profile: 'Profile',
        settings: 'Settings',
        signOut: 'Sign Out'
      }
    },
    zh: {
      hero: {
        title: 'AI智能写作助手',
        subtitle: '开启智能写作之旅',
        prompt: '今天想创作什么？'
      },
      writingTypes: {
        freeform: {
          title: '自由创作',
          description: '从灵感出发，让AI为您导航',
          startMessage: '让我们开始自由创作吧，我会为您提供指导。',
          prompt: '您想写些什么？',
          placeholder: '输入您的主题或核心想法...',
          tonePrompt: '选择写作风格：',
          tones: {
            professional: '专业正式',
            casual: '轻松随意',
            academic: '学术严谨',
            creative: '创意灵活'
          },
          pointsPrompt: '有什么具体要点需要涵盖吗？',
          pointsPlaceholder: '输入关键要点（可选）'
        },
        structured: {
          title: '结构化写作',
          description: '运用模板和大纲，构建有序内容',
          startMessage: '让我们一起创建结构化内容。',
          typePrompt: '选择内容类型：',
          types: {
            blog: '博客文章',
            article: '文章',
            report: '报告',
            docs: '文档'
          },
          topicPrompt: '主题是什么？',
          topicPlaceholder: '输入主要内容...'
        },
        collaborative: {
          title: '协作创作',
          description: '与AI助手共同完成创作',
          startMessage: '让我们开始协作创作。',
          projectPrompt: '描述您的项目：',
          projectPlaceholder: '您在进行什么项目？',
          helpPrompt: '需要AI如何协助？',
          helpTypes: {
            ideation: '生成创意',
            expansion: '扩展内容',
            review: '审阅编辑',
            research: '研究支持'
          }
        },
        academic: {
          title: '学术写作',
          description: '专业论文与学术内容',
          startMessage: '让我们开始撰写学术论文。',
          topicPrompt: '您的研究主题是什么？',
          topicPlaceholder: '输入研究主题...',
          typePrompt: '选择论文类型：',
          types: {
            research: '研究论文',
            review: '文献综述',
            caseStudy: '案例研究',
            thesis: '学位论文'
          }
        },
        common: {
          startingMessage: '太好了！让我帮您创建内容。'
        }
      },
      features: {
        understanding: {
          title: '智能理解',
          description: 'AI深入理解您的目标，适应您的写作风格'
        },
        suggestions: {
          title: '实时建议',
          description: '获取智能写作建议和指导'
        },
        enhancement: {
          title: '自动优化',
          description: '自动提升文章的清晰度和可读性'
        }
      },
      nav: {
        home: '首页',
        papers: '我的文章',
        references: '参考文献',
        newPaper: '新建文章',
        help: '帮助中心',
        privacy: '隐私政策',
        profile: '个人中心',
        settings: '设置',
        signOut: '退出登录'
      }
    }
  }

  function setLanguage(lang) {
    currentLanguage.value = lang
  }

  function t(key) {
    const keys = key.split('.')
    let translation = translations[currentLanguage.value]
    
    for (const k of keys) {
      translation = translation[k]
      if (!translation) return key
    }
    
    return translation
  }

  return {
    currentLanguage,
    setLanguage,
    t
  }
})