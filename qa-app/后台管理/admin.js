/* 问答APP后台管理系统脚本 */

// 全选/取消全选
function toggleSelectAll(checkbox) {
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = checkbox.checked);
    updateBatchActions();
}

// 更新批量操作按钮状态
function updateBatchActions() {
    const checked = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    const batchActions = document.getElementById('batchActions');
    if (batchActions) {
        batchActions.style.display = checked.length > 0 ? 'flex' : 'none';
    }
}

// 审核通过
function approve(id, type) {
    if (confirm('确定要通过审核吗？')) {
        alert(`${type} ID: ${id} 已通过审核`);
        location.reload();
    }
}

// 审核拒绝
function reject(id, type) {
    const reason = prompt('请输入拒绝原因：');
    if (reason) {
        alert(`${type} ID: ${id} 已拒绝，原因：${reason}`);
        location.reload();
    }
}

// 删除
function deleteItem(id, type) {
    if (confirm(`确定要删除这个${type}吗？此操作不可恢复。`)) {
        alert(`${type} ID: ${id} 已删除`);
        location.reload();
    }
}

// 封禁用户
function banUser(id) {
    const days = prompt('请输入封禁天数（0表示永久封禁）：');
    if (days !== null) {
        alert(`用户 ID: ${id} 已被封禁 ${days == 0 ? '永久' : days + '天'}`);
        location.reload();
    }
}

// 解封用户
function unbanUser(id) {
    if (confirm('确定要解封该用户吗？')) {
        alert(`用户 ID: ${id} 已解封`);
        location.reload();
    }
}

// 认证用户
function verifyUser(id) {
    if (confirm('确定要认证该用户吗？')) {
        alert(`用户 ID: ${id} 已认证`);
        location.reload();
    }
}

// 处理提现
function processWithdraw(id, action) {
    if (action === 'approve') {
        if (confirm('确定要通过该提现申请吗？')) {
            alert(`提现 ID: ${id} 已通过`);
            location.reload();
        }
    } else {
        const reason = prompt('请输入拒绝原因：');
        if (reason) {
            alert(`提现 ID: ${id} 已拒绝，原因：${reason}`);
            location.reload();
        }
    }
}

// 处理举报
function handleReport(id, action) {
    if (action === 'valid') {
        const punishment = prompt('请选择处罚方式：\n1. 删除内容\n2. 警告用户\n3. 封禁用户');
        if (punishment) {
            alert(`举报 ID: ${id} 已处理`);
            location.reload();
        }
    } else {
        if (confirm('确定要忽略该举报吗？')) {
            alert(`举报 ID: ${id} 已忽略`);
            location.reload();
        }
    }
}

// 搜索
function search(type) {
    const input = document.getElementById('searchInput');
    if (input && input.value) {
        alert(`搜索 ${type}：${input.value}`);
    }
}

// 筛选
function filter(type, value) {
    alert(`筛选 ${type}：${value}`);
}

// 导出数据
function exportData(type) {
    alert(`正在导出 ${type} 数据...`);
}

// 批量操作
function batchAction(action) {
    const checked = document.querySelectorAll('tbody input[type="checkbox"]:checked');
    const ids = Array.from(checked).map(cb => cb.value);
    
    if (ids.length === 0) {
        alert('请先选择要操作的项目');
        return;
    }
    
    switch(action) {
        case 'approve':
            if (confirm(`确定要批量通过 ${ids.length} 个项目吗？`)) {
                alert('批量通过成功');
                location.reload();
            }
            break;
        case 'reject':
            if (confirm(`确定要批量拒绝 ${ids.length} 个项目吗？`)) {
                alert('批量拒绝成功');
                location.reload();
            }
            break;
        case 'delete':
            if (confirm(`确定要批量删除 ${ids.length} 个项目吗？此操作不可恢复。`)) {
                alert('批量删除成功');
                location.reload();
            }
            break;
    }
}

// 切换标签页
function switchTab(el, tabId) {
    // 更新标签按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    el.classList.add('active');
    
    // 更新内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(tabId).classList.remove('hidden');
}

// 打开模态框
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

// 关闭模态框
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// 查看详情
function viewDetail(id, type) {
    alert(`查看 ${type} 详情，ID: ${id}`);
}

// 编辑
function edit(id, type) {
    alert(`编辑 ${type}，ID: ${id}`);
}

// 发送系统消息
function sendSystemMessage() {
    const title = document.getElementById('msgTitle');
    const content = document.getElementById('msgContent');
    const target = document.getElementById('msgTarget');
    
    if (title && content && title.value && content.value) {
        alert(`系统消息已发送\n标题：${title.value}\n目标：${target ? target.value : '全部用户'}`);
        closeModal('messageModal');
    } else {
        alert('请填写完整信息');
    }
}

// 添加话题
function addTopic() {
    const name = prompt('请输入话题名称：');
    if (name) {
        alert(`话题 #${name} 已添加`);
        location.reload();
    }
}

// 设置热门话题
function setHotTopic(id) {
    if (confirm('确定要将该话题设为热门吗？')) {
        alert(`话题 ID: ${id} 已设为热门`);
        location.reload();
    }
}

// 保存设置
function saveSettings() {
    alert('设置已保存');
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 绑定复选框事件
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateBatchActions);
    });
});
