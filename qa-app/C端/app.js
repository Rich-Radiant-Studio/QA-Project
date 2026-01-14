/* 问答APP 通用脚本 */

// 标签切换
function switchTab(el) {
    const parent = el.parentElement;
    parent.querySelectorAll('.tab-item, [class*="tab-"]').forEach(tab => {
        tab.classList.remove('tab-active', 'answer-tab-active');
        tab.classList.add('text-gray-500');
    });
    el.classList.add('tab-active');
    el.classList.remove('text-gray-500');
}

// 回答标签切换
function switchAnswerTab(el) {
    const parent = el.parentElement;
    parent.querySelectorAll('button').forEach(tab => {
        tab.classList.remove('answer-tab-active');
        tab.classList.add('text-gray-500');
    });
    el.classList.add('answer-tab-active');
    el.classList.remove('text-gray-500');
}

// 点赞切换
function toggleLike(btn) {
    const icon = btn.querySelector('i');
    const count = btn.querySelector('span');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.classList.remove('text-gray-500');
        btn.classList.add('text-red-500');
        count.textContent = parseInt(count.textContent) + 1;
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.classList.remove('text-red-500');
        btn.classList.add('text-gray-500');
        count.textContent = parseInt(count.textContent) - 1;
    }
}

// 踩切换
function toggleDislike(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.classList.remove('text-gray-500');
        btn.classList.add('text-gray-700');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.classList.remove('text-gray-700');
        btn.classList.add('text-gray-500');
    }
}

// 投票功能
function vote(type) {
    alert(type === 'solved' ? '感谢您的反馈！' : '我们会继续寻找更好的答案');
}

// ========== 发布问题页功能 ==========
let currentType = 'free';
let selectedReward = 0;

// 选择问题类型
function selectType(el, type) {
    document.querySelectorAll('.type-card').forEach(card => {
        card.classList.remove('active');
        card.classList.add('border-gray-200');
        const icon = card.querySelector('.type-icon');
        if (icon) {
            icon.classList.add('text-gray-400');
            icon.classList.remove('text-red-500');
        }
    });
    el.classList.add('active');
    el.classList.remove('border-gray-200');
    const icon = el.querySelector('.type-icon');
    if (icon) {
        icon.classList.remove('text-gray-400');
    }
    
    currentType = type;
    const rewardSection = document.getElementById('rewardSection');
    if (rewardSection) {
        rewardSection.classList.toggle('hidden', type !== 'reward');
    }
}

// 选择悬赏金额
function selectReward(el, amount) {
    document.querySelectorAll('.reward-btn').forEach(btn => {
        btn.classList.remove('bg-red-500', 'text-white', 'border-red-500');
        btn.classList.add('border-gray-200');
    });
    el.classList.add('bg-red-500', 'text-white', 'border-red-500');
    el.classList.remove('border-gray-200');
    selectedReward = amount;
}

// 切换话题选择
function toggleTopic(el) {
    el.classList.toggle('bg-red-500');
    el.classList.toggle('text-white');
    el.classList.toggle('bg-gray-100');
    el.classList.toggle('text-gray-600');
}

// 更新标题字数
function updateTitleCount() {
    const input = document.getElementById('titleInput');
    const count = document.getElementById('titleCount');
    if (input && count) {
        count.textContent = input.value.length;
    }
}

// 更新描述字数
function updateDescCount() {
    const input = document.getElementById('descInput');
    const count = document.getElementById('descCount');
    if (input && count) {
        count.textContent = input.value.length;
    }
}

// 添加图片
function addImage() {
    const grid = document.getElementById('imageGrid');
    if (grid && grid.children.length < 10) {
        const img = document.createElement('div');
        img.className = 'aspect-square bg-gray-200 rounded-lg relative';
        img.innerHTML = `
            <img src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=200&h=200&fit=crop" class="w-full h-full object-cover rounded-lg">
            <button class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs" onclick="this.parentElement.remove()">×</button>
        `;
        grid.insertBefore(img, grid.lastElementChild);
    }
}

// 保存草稿
function saveDraft() {
    alert('草稿已保存');
}

// 发布问题
function publish() {
    const title = document.getElementById('titleInput');
    if (title && (!title.value || title.value.length < 5)) {
        alert('请输入至少5个字的问题标题');
        return;
    }
    alert('发布成功！');
    window.location.href = '首页.html';
}

// ========== 搜索页功能 ==========
function handleSearch() {
    const input = document.getElementById('searchInput');
    const before = document.getElementById('beforeSearch');
    const after = document.getElementById('afterSearch');
    
    if (input && before && after) {
        if (input.value.length > 0) {
            before.classList.add('hidden');
            after.classList.remove('hidden');
        } else {
            before.classList.remove('hidden');
            after.classList.add('hidden');
        }
    }
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    if (input) {
        input.value = '';
        handleSearch();
    }
}
