<template>
  <div class="system-scene">
    <div class="scene-top">
      <div class="scene-heading">
        <div class="scene-eyebrow">System Demo</div>
        <h2 class="scene-title">跨时间域生物面部识别系统演示</h2>
        <p class="scene-desc">
          以非人类生物面部识别为主任务，并通过公开人脸数据集进行迁移验证。
          当前页面统一展示查询样本、Top-k 检索结果、时间阶段预测与跨时间匹配能力。
        </p>
      </div>

      <div class="scene-actions">
        <a-segmented
          v-model:value="activeDomain"
          class="domain-switch"
          :options="[
            { label: '非人类生物主任务', value: 'nonhuman' },
            { label: '人脸迁移验证', value: 'human' }
          ]"
        />

        <a-segmented
          v-model:value="topK"
          :options="[
            { label: 'Top-3', value: 3 },
            { label: 'Top-5', value: 5 }
          ]"
        />
      </div>
    </div>

    <div class="overview-grid">
      <BaseCard
        title="Demo Flow"
        subtitle="适合录屏的稳定演示路径"
        padding="md"
      >
        <div class="flow-row">
          <div class="flow-step">
            <span>01</span>
            选择测试样本
          </div>
          <div class="flow-step">
            <span>02</span>
            启动检索
          </div>
          <div class="flow-step">
            <span>03</span>
            展示 Top-k
          </div>
          <div class="flow-step">
            <span>04</span>
            输出预测结论
          </div>
        </div>
      </BaseCard>

      <BaseCard
        title="Current Highlight"
        subtitle="本页重点强调跨时间与跨域泛化能力"
        padding="md"
      >
        <div class="highlight-copy">
          <div class="highlight-point">
            {{ activeDomain === 'nonhuman' ? '非人类生物跨年份个体检索' : '人脸公开数据迁移验证' }}
          </div>
          <div class="highlight-point">显式展示时间阶段预测结果</div>
          <div class="highlight-point">统一检索界面表达主任务与泛化验证</div>
        </div>
      </BaseCard>
    </div>

    <div class="main-grid">
      <BaseCard
        class="query-card"
        title="Query Sample"
        subtitle="输入测试图像并控制检索流程"
        padding="lg"
      >
        <div class="query-panel">
          <div class="query-preview">
            <!-- TODO(real-data): Replace the demo query image source with a real local/file-service image field. -->
            <img
              :src="currentCase.queryImage"
              :alt="currentCase.name"
              class="query-image"
            />
            <div class="query-badges">
              <span class="tag tag-dark">{{ currentCase.subjectId }}</span>
              <span class="tag">{{ currentCase.queryYear }}</span>
              <span class="tag">{{ currentCase.stageLabel }}</span>
              <span class="tag">{{ currentCase.domainLabel }}</span>
            </div>
          </div>

          <div class="query-meta">
            <div class="sample-title">{{ currentCase.name }}</div>
            <div class="sample-desc">{{ currentCase.description }}</div>

            <div class="sample-info-list">
              <div class="info-row">
                <span>Domain</span>
                <strong>{{ currentCase.domainLabel }}</strong>
              </div>
              <div class="info-row">
                <span>Subject ID</span>
                <strong>{{ currentCase.subjectId }}</strong>
              </div>
              <div class="info-row">
                <span>{{ activeDomain === 'nonhuman' ? 'Species' : 'Dataset' }}</span>
                <strong>{{ currentCase.source }}</strong>
              </div>
              <div class="info-row">
                <span>Query Year / Stage</span>
                <strong>{{ currentCase.queryYear }} · {{ currentCase.stageLabel }}</strong>
              </div>
              <div class="info-row">
                <span>Expected Behavior</span>
                <strong>{{ currentCase.expected }}</strong>
              </div>
            </div>

            <div class="selector-wrap">
              <div class="selector-label">切换演示样本</div>
              <a-select
                v-model:value="activeCaseId"
                class="sample-select"
                size="large"
                :options="caseOptions"
              />
            </div>

            <div class="action-row">
              <a-button
                type="primary"
                size="large"
                class="run-btn"
                :loading="isRunning"
                @click="runDemo"
              >
                开始识别
              </a-button>

              <a-button size="large" @click="resetDemo">
                重置结果
              </a-button>
            </div>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        class="results-card"
        title="Top-k Retrieval Results"
        subtitle="展示最相似的历史候选结果"
        padding="lg"
      >
        <div v-if="!hasStarted" class="empty-state">
          <scan-outlined class="empty-icon" />
          <div class="empty-title">等待开始演示</div>
          <div class="empty-desc">
            点击左侧“开始识别”后，将模拟展示系统输出结果。
          </div>
        </div>

        <div v-else-if="isRunning" class="loading-state">
          <a-spin size="large" />
          <div class="loading-title">模型分析中...</div>
          <div class="loading-desc">
            正在提取特征、执行跨时间检索并生成预测结果
          </div>
        </div>

        <div v-else class="results-grid">
          <div
            v-for="(item, index) in visibleResults"
            :key="`${currentCase.id}-${index}`"
            class="result-item"
            :class="{
              'result-item--correct': item.isCorrect,
              'result-item--cross': item.isCrossTime
            }"
          >
            <div class="result-rank">Top {{ index + 1 }}</div>

            <div class="result-image-wrap">
              <!-- TODO(real-data): Replace the demo retrieval image source with the real matched sample image field. -->
              <img
                :src="item.image"
                :alt="item.subjectId"
                class="result-image"
              />
              <span v-if="item.isCorrect" class="result-corner success">
                Match
              </span>
              <span v-else class="result-corner neutral">
                Candidate
              </span>
            </div>

            <div class="result-meta">
              <div class="result-id">{{ item.subjectId }}</div>
              <div class="result-source">{{ item.source }}</div>

              <div class="result-year-row">
                <span>{{ item.year }}</span>
                <span v-if="item.isCrossTime" class="mini-chip">
                  Cross-Time
                </span>
              </div>

              <div class="score-line">
                <span>Similarity</span>
                <strong>{{ item.score }}</strong>
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <div class="side-column">
        <BaseCard
          title="Prediction Summary"
          subtitle="聚合展示最终系统判断"
          padding="lg"
        >
          <div v-if="!hasResult" class="summary-empty">
            结果将在识别完成后显示。
          </div>

          <div v-else class="summary-panel">
            <div class="summary-main">
              <div class="summary-block">
                <span class="summary-label">Predicted Subject</span>
                <strong>{{ prediction.subjectId }}</strong>
              </div>

              <div class="summary-block">
                <span class="summary-label">Top-1 Score</span>
                <strong>{{ prediction.score }}</strong>
              </div>

              <div class="summary-block">
                <span class="summary-label">Predicted Time Stage</span>
                <strong>{{ prediction.stage }}</strong>
              </div>

              <div class="summary-block">
                <span class="summary-label">Matched Historical Year</span>
                <strong>{{ prediction.year }}</strong>
              </div>

              <div class="summary-block">
                <span class="summary-label">{{ activeDomain === 'nonhuman' ? 'Species' : 'Validation Dataset' }}</span>
                <strong>{{ prediction.source }}</strong>
              </div>
            </div>

            <div class="judge-box" :class="{ success: prediction.isCorrect }">
              <div class="judge-title">
                {{ prediction.isCorrect ? '识别成功' : '识别失败' }}
              </div>
              <div class="judge-desc">
                {{ prediction.message }}
              </div>
            </div>
          </div>
        </BaseCard>

        <BaseCard
          title="Narration Tip"
          subtitle="录制视频时可直接口播"
          padding="lg"
        >
          <div class="narration-copy">
            <p v-if="activeDomain === 'nonhuman'">
              当前展示的是 <strong>非人类生物主任务</strong>，样例来源于
              <strong>{{ currentCase.source }}</strong> 数据。
            </p>
            <p v-else>
              当前展示的是 <strong>人脸迁移验证</strong>，样例来源于
              <strong>{{ currentCase.source }}</strong> 数据集。
            </p>

            <p>
              输入图像来自 <strong>{{ currentCase.queryYear }}</strong> 年，
              系统在历史图库中检索出最相似的候选结果，并同步给出时间阶段预测。
            </p>

            <p>
              该页面强调：我们的模型不仅面向非人类生物跨时间识别，
              也可在人脸公开数据上验证其跨时间泛化能力。
            </p>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ScanOutlined } from '@ant-design/icons-vue'
import BaseCard from '@/components/common/BaseCard.vue'

// TODO(real-data): Replace all mock cases below with real API/local dataset records.
// queryImage and results[].image are the current demo photo placeholders.
const nonHumanCases = [
  {
    id: 'nonhuman-1',
    domain: 'nonhuman',
    domainLabel: 'Non-human Biometric',
    name: 'Case A · Brown Bear Subject 023',
    subjectId: 'NH-023',
    source: 'Brown Bear Dataset',
    queryYear: 2022,
    stageLabel: 'Late Stage',
    expected: '跨年份 Top-1 命中',
    description: '该非人类生物样例展示了多年后毛发、姿态与拍摄条件变化下的个体匹配能力。',
    queryImage: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80',
    prediction: {
      subjectId: 'NH-023',
      score: '0.92',
      stage: 'Late Stage',
      year: '2019',
      source: 'Brown Bear Dataset',
      isCorrect: true,
      message: '系统成功在不同年份的非人类生物图库中命中同一个体。'
    },
    results: [
      {
        image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-023',
        source: 'Brown Bear Dataset',
        year: 2019,
        score: '0.92',
        isCorrect: true,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-041',
        source: 'Brown Bear Dataset',
        year: 2020,
        score: '0.81',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-017',
        source: 'Brown Bear Dataset',
        year: 2018,
        score: '0.76',
        isCorrect: false,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-102',
        source: 'Brown Bear Dataset',
        year: 2021,
        score: '0.72',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-056',
        source: 'Brown Bear Dataset',
        year: 2017,
        score: '0.69',
        isCorrect: false,
        isCrossTime: true
      }
    ]
  },
  {
    id: 'nonhuman-2',
    domain: 'nonhuman',
    domainLabel: 'Non-human Biometric',
    name: 'Case B · Large Mammal Subject 011',
    subjectId: 'NH-011',
    source: 'Large Mammal Dataset',
    queryYear: 2021,
    stageLabel: 'Middle Stage',
    expected: 'Top-5 内稳定命中',
    description: '该样例模拟大型哺乳类在遮挡、视角变化下的跨时间候选检索过程。',
    queryImage: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=900&q=80',
    prediction: {
      subjectId: 'NH-011',
      score: '0.87',
      stage: 'Middle Stage',
      year: '2018',
      source: 'Large Mammal Dataset',
      isCorrect: true,
      message: '虽然存在遮挡与视角变化，系统仍在前列候选中返回正确个体。'
    },
    results: [
      {
        image: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-014',
        source: 'Large Mammal Dataset',
        year: 2020,
        score: '0.88',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-011',
        source: 'Large Mammal Dataset',
        year: 2018,
        score: '0.87',
        isCorrect: true,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-021',
        source: 'Large Mammal Dataset',
        year: 2021,
        score: '0.79',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-067',
        source: 'Large Mammal Dataset',
        year: 2017,
        score: '0.74',
        isCorrect: false,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
        subjectId: 'NH-045',
        source: 'Large Mammal Dataset',
        year: 2019,
        score: '0.70',
        isCorrect: false,
        isCrossTime: true
      }
    ]
  }
]

const humanCases = [
  {
    id: 'human-1',
    domain: 'human',
    domainLabel: 'Human Transfer Validation',
    name: 'Case C · Human Face Validation 008',
    subjectId: 'H-008',
    source: 'AgeDB',
    queryYear: 2020,
    stageLabel: 'Age Shift',
    expected: '跨年龄阶段 Top-1 命中',
    description: '该样例用于展示模型在人脸公开数据集上的迁移验证结果，强调跨时间泛化能力。',
    queryImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
    prediction: {
      subjectId: 'H-008',
      score: '0.91',
      stage: 'Age Shift',
      year: '2016',
      source: 'AgeDB',
      isCorrect: true,
      message: '模型在人脸公开数据上同样能够保持较好的跨时间匹配效果。'
    },
    results: [
      {
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-008',
        source: 'AgeDB',
        year: 2016,
        score: '0.91',
        isCorrect: true,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-021',
        source: 'AgeDB',
        year: 2018,
        score: '0.82',
        isCorrect: false,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-046',
        source: 'AgeDB',
        year: 2020,
        score: '0.77',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-052',
        source: 'AgeDB',
        year: 2017,
        score: '0.73',
        isCorrect: false,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-031',
        source: 'AgeDB',
        year: 2019,
        score: '0.69',
        isCorrect: false,
        isCrossTime: true
      }
    ]
  },
  {
    id: 'human-2',
    domain: 'human',
    domainLabel: 'Human Transfer Validation',
    name: 'Case D · Human Face Validation 021',
    subjectId: 'H-021',
    source: 'CACD / FG-NET',
    queryYear: 2019,
    stageLabel: 'Temporal Shift',
    expected: 'Top-5 内保持稳定',
    description: '该样例模拟模型在人脸公开数据集上的跨时间迁移检索过程。',
    queryImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80',
    prediction: {
      subjectId: 'H-021',
      score: '0.86',
      stage: 'Temporal Shift',
      year: '2014',
      source: 'CACD / FG-NET',
      isCorrect: true,
      message: '模型在人脸迁移验证集上保持了较稳定的识别表现。'
    },
    results: [
      {
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-018',
        source: 'CACD / FG-NET',
        year: 2018,
        score: '0.87',
        isCorrect: false,
        isCrossTime: false
      },
      {
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-021',
        source: 'CACD / FG-NET',
        year: 2014,
        score: '0.86',
        isCorrect: true,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-041',
        source: 'CACD / FG-NET',
        year: 2016,
        score: '0.79',
        isCorrect: false,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-063',
        source: 'CACD / FG-NET',
        year: 2017,
        score: '0.74',
        isCorrect: false,
        isCrossTime: true
      },
      {
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        subjectId: 'H-005',
        source: 'CACD / FG-NET',
        year: 2015,
        score: '0.71',
        isCorrect: false,
        isCrossTime: true
      }
    ]
  }
]

const activeDomain = ref('nonhuman')
const activeCaseId = ref(nonHumanCases[0].id)
const isRunning = ref(false)
const hasStarted = ref(false)
const hasResult = ref(false)
const topK = ref(5)

const currentCaseList = computed(() => {
  return activeDomain.value === 'nonhuman' ? nonHumanCases : humanCases
})

const currentCase = computed(() => {
  return currentCaseList.value.find(item => item.id === activeCaseId.value) || currentCaseList.value[0]
})

const caseOptions = computed(() => {
  return currentCaseList.value.map(item => ({
    label: item.name,
    value: item.id
  }))
})

const visibleResults = computed(() => {
  return currentCase.value.results.slice(0, topK.value)
})

const prediction = computed(() => {
  if (!hasResult.value) return {}
  return currentCase.value.prediction
})

const resetDemo = () => {
  isRunning.value = false
  hasStarted.value = false
  hasResult.value = false
}

const runDemo = () => {
  hasStarted.value = true
  hasResult.value = false
  isRunning.value = true

  setTimeout(() => {
    isRunning.value = false
    hasResult.value = true
  }, 1200)
}

watch(activeCaseId, () => {
  resetDemo()
})

watch(activeDomain, (domain) => {
  activeCaseId.value = domain === 'nonhuman' ? nonHumanCases[0].id : humanCases[0].id
  resetDemo()
})
</script>

<style scoped>
.system-scene {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.scene-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.scene-heading {
  max-width: 760px;
}

.scene-eyebrow {
  margin-bottom: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.scene-title {
  margin: 0;
  font-size: 30px;
  line-height: 1.1;
  font-weight: 800;
  color: #0f172a;
}

.scene-desc {
  margin: 10px 0 0;
  max-width: 760px;
  font-size: 14px;
  line-height: 1.7;
  color: #64748b;
}

.scene-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.domain-switch {
  width: fit-content;
  min-width: 0;
  flex: 0 0 auto;
}

.overview-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
}

.flow-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.flow-step {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.flow-step span {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #0f172a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.highlight-copy {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.highlight-point {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
}

.main-grid {
  display: grid;
  grid-template-columns: 1.15fr 1.45fr 0.8fr;
  gap: 20px;
  align-items: start;
}

.query-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.query-preview {
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  background: #f8fafc;
}

.query-image {
  width: 100%;
  height: 280px;
  display: block;
  object-fit: cover;
}

.query-badges {
  position: absolute;
  left: 14px;
  bottom: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #334155;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(6px);
}

.tag-dark {
  background: rgba(15, 23, 42, 0.9);
  color: #ffffff;
}

.sample-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.sample-desc {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.sample-info-list {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
}

.info-row span {
  font-size: 13px;
  color: #64748b;
}

.info-row strong {
  font-size: 13px;
  color: #0f172a;
  text-align: right;
}

.selector-wrap {
  margin-top: 18px;
}

.selector-label {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.sample-select {
  width: 100%;
}

.action-row {
  margin-top: 18px;
  display: flex;
  gap: 12px;
}

.run-btn {
  background: #0f172a;
  border-color: #0f172a;
}

.run-btn:hover,
.run-btn:focus {
  background: #1e293b !important;
  border-color: #1e293b !important;
}

.empty-state,
.loading-state {
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  color: #94a3b8;
}

.empty-title,
.loading-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.empty-desc,
.loading-desc {
  max-width: 340px;
  font-size: 13px;
  line-height: 1.7;
  color: #64748b;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.result-item {
  position: relative;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 24px rgba(15, 23, 42, 0.06);
}

.result-item--correct {
  border-color: #86efac;
  background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
}

.result-item--cross {
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.08);
}

.result-rank {
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.result-image-wrap {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #e2e8f0;
}

.result-image {
  width: 100%;
  height: 170px;
  display: block;
  object-fit: cover;
}

.result-corner {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  backdrop-filter: blur(6px);
}

.result-corner.success {
  background: rgba(34, 197, 94, 0.16);
  color: #166534;
  border: 1px solid rgba(34, 197, 94, 0.24);
}

.result-corner.neutral {
  background: rgba(255, 255, 255, 0.88);
  color: #475569;
  border: 1px solid rgba(226, 232, 240, 0.95);
}

.result-meta {
  margin-top: 12px;
}

.result-id {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.result-source {
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
}

.result-year-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
}

.mini-chip {
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 700;
}

.score-line {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #64748b;
  font-size: 12px;
}

.score-line strong {
  color: #0f172a;
  font-size: 14px;
}

.side-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.summary-empty {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
}

.summary-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.summary-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-block {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

.summary-label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: #64748b;
}

.summary-block strong {
  font-size: 15px;
  color: #0f172a;
}

.judge-box {
  padding: 14px 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.judge-box.success {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.judge-title {
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;
}

.judge-desc {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.7;
  color: #475569;
}

.narration-copy {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
  line-height: 1.8;
  color: #475569;
}

.narration-copy p {
  margin: 0;
}

@media (max-width: 1400px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .side-column {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 1100px) {
  .overview-grid {
    grid-template-columns: 1fr;
  }

  .flow-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .scene-top {
    flex-direction: column;
    align-items: stretch;
  }

  .scene-title {
    font-size: 24px;
  }

  .scene-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .domain-switch {
    min-width: 0;
  }

  .results-grid,
  .side-column {
    grid-template-columns: 1fr;
  }

  .flow-row {
    grid-template-columns: 1fr;
  }

  .action-row {
    flex-direction: column;
  }

  .query-image {
    height: 220px;
  }

  .result-image {
    height: 180px;
  }
}
</style>
