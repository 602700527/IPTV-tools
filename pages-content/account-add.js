
async function loadTopics(selectedTopicId) {
  const container = document.getElementById('topicSelector');
  const loadingEl = document.getElementById('topicLoading');
  
  try {
    // 加载线路列表
    const response = await fetch('/api/subscription/topics');
    const data = await response.json();
    
    if (loadingEl) loadingEl.remove();
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!data.topics || data.topics.length === 0) {
      container.innerHTML = '<span style="color: var(--text-muted); font-size: 0.9rem;">暂无可用线路</span>';
      return;
    }
    
    // 创建线路选项
    data.topics.forEach(topic => {
      const label = document.createElement('label');
      label.className = 'topic-option';
      label.innerHTML = `
        <input type="radio" name="topic" value="${topic.id}" ${selectedTopicId == topic.id ? 'checked' : ''}>
        <span class="topic-label">${topic.name}</span>
      `;
      label.querySelector('input').onchange = () => saveTopic(topic.id);
      container.appendChild(label);
    });
    
    // 如果有选中的线路，显示提示
    if (selectedTopicId) {
      const hintEl = document.getElementById('topicHint');
      if (hintEl) {
        const selected = data.topics.find(t => t.id == selectedTopicId);
        if (selected) {
          hintEl.textContent = '当前选择：' + selected.name;
          hintEl.style.color = 'var(--accent)';
        }
      }
    }
    
  } catch (e) {
    console.error('加载线路失败:', e);
    if (loadingEl) loadingEl.textContent = '加载失败，请刷新页面';
  }
}

async function saveTopic(topicId) {
  const code = window._currentCode;
  if (!code) return;
  
  try {
    const response = await fetch('/api/user/change-topic?code=' + code, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic_id: topicId })
    });
    
    const data = await response.json();
    if (data.success) {
      const hintEl = document.getElementById('topicHint');
      if (hintEl) {
        hintEl.textContent = '已切换到：' + (data.topic_name || '当前线路');
        hintEl.style.color = 'var(--accent)';
      }
    } else {
      console.error('保存线路失败:', data.error);
    }
  } catch (e) {
    console.error('保存线路错误:', e);
  }
}

