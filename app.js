// JobTrack Application
class JobTrackApp {
    constructor() {
        this.jobs = JSON.parse(localStorage.getItem('jobtrack_data')) || [];
        this.currentView = 'list'; // 默认视图
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateViewToggle();
        
        // 设置默认日期为今天
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('applicationDate').value = today;
    }

    bindEvents() {
        // 视图切换
        document.getElementById('listViewBtn').addEventListener('click', () => {
            this.switchView('list');
        });
        document.getElementById('ganttViewBtn').addEventListener('click', () => {
            this.switchView('gantt');
        });

        // 添加记录按钮
        document.getElementById('addRecordBtn').addEventListener('click', () => {
            this.openAddRecordModal();
        });
        document.getElementById('addRecordEmptyBtn').addEventListener('click', () => {
            this.openAddRecordModal();
        });

        // 模态框事件
        document.querySelector('#recordModal .close').addEventListener('click', () => {
            this.closeModal('recordModal');
        });
        document.getElementById('cancelModalBtn').addEventListener('click', () => {
            this.closeModal('recordModal');
        });
        document.getElementById('recordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveRecord();
        });

        // 状态更新模态框事件
        document.querySelector('#statusModal .close').addEventListener('click', () => {
            this.closeModal('statusModal');
        });
        document.getElementById('cancelStatusModalBtn').addEventListener('click', () => {
            this.closeModal('statusModal');
        });
        document.getElementById('statusForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateStatus();
        });

        // 详情模态框事件
        document.querySelector('#detailModal .close').addEventListener('click', () => {
            this.closeModal('detailModal');
        });
        document.getElementById('closeDetailModalBtn').addEventListener('click', () => {
            this.closeModal('detailModal');
        });
        document.getElementById('deleteRecordBtn').addEventListener('click', () => {
            this.deleteRecord();
        });

        // 筛选器事件
        document.getElementById('companyFilter').addEventListener('input', () => {
            this.render();
        });
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.render();
        });
        document.getElementById('startDateFilter').addEventListener('change', () => {
            this.render();
        });
        document.getElementById('endDateFilter').addEventListener('change', () => {
            this.render();
        });
        document.getElementById('clearFiltersBtn').addEventListener('click', () => {
            this.clearFilters();
        });

        // 导出功能
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportToCSV();
        });

        // 状态选择变化事件
        document.getElementById('status').addEventListener('change', (e) => {
            const customInput = document.getElementById('customStatus');
            if (e.target.value === 'other') {
                customInput.style.display = 'block';
                customInput.required = true;
            } else {
                customInput.style.display = 'none';
                customInput.required = false;
            }
        });

        document.getElementById('updateStatus').addEventListener('change', (e) => {
            const customInput = document.getElementById('customUpdateStatus');
            if (e.target.value === 'other') {
                customInput.style.display = 'block';
                customInput.required = true;
            } else {
                customInput.style.display = 'none';
                customInput.required = false;
            }
        });
    }

    switchView(view) {
        this.currentView = view;
        this.render();
        this.updateViewToggle();
    }

    updateViewToggle() {
        document.getElementById('listViewBtn').classList.toggle('active', this.currentView === 'list');
        document.getElementById('ganttViewBtn').classList.toggle('active', this.currentView === 'gantt');
        document.getElementById('listView').classList.toggle('active', this.currentView === 'list');
        document.getElementById('ganttView').classList.toggle('active', this.currentView === 'gantt');
        
        // 渲染对应视图
        if (this.currentView === 'gantt') {
            this.renderGanttChart();
        }
    }

    openAddRecordModal(id = null) {
        const modal = document.getElementById('recordModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('recordForm');
        
        if (id) {
            // 编辑模式
            const job = this.jobs.find(job => job.id === id);
            if (job) {
                title.textContent = '编辑求职记录';
                document.getElementById('companyName').value = job.company;
                document.getElementById('position').value = job.position;
                document.getElementById('applicationDate').value = job.applicationDate;
                document.getElementById('status').value = job.status;
                
                // 如果是自定义状态，需要特殊处理
                if (!['已投递', '初面', '二面', '终面', 'Offer', '拒信'].includes(job.status)) {
                    document.getElementById('status').value = 'other';
                    document.getElementById('customStatus').value = job.status;
                    document.getElementById('customStatus').style.display = 'block';
                } else {
                    document.getElementById('customStatus').style.display = 'none';
                }
                
                form.dataset.editId = id;
            }
        } else {
            // 添加模式
            title.textContent = '添加求职记录';
            form.reset();
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('applicationDate').value = today;
            document.getElementById('status').value = '已投递';
            document.getElementById('customStatus').style.display = 'none';
            delete form.dataset.editId;
        }
        
        modal.style.display = 'block';
    }

    saveRecord() {
        const companyName = document.getElementById('companyName').value.trim();
        const position = document.getElementById('position').value.trim();
        const applicationDate = document.getElementById('applicationDate').value;
        let status = document.getElementById('status').value;
        
        if (status === 'other') {
            status = document.getElementById('customStatus').value.trim();
            if (!status) {
                alert('请输入自定义状态');
                return;
            }
        }
        
        if (!companyName) {
            alert('请输入公司名称');
            return;
        }
        
        const newRecord = {
            id: Date.now().toString(),
            company: companyName,
            position: position,
            applicationDate: applicationDate,
            status: status,
            statusHistory: [{
                status: status,
                timestamp: new Date().toLocaleString()
            }]
        };
        
        if (document.getElementById('recordForm').dataset.editId) {
            // 编辑现有记录
            const editId = document.getElementById('recordForm').dataset.editId;
            const index = this.jobs.findIndex(job => job.id === editId);
            if (index !== -1) {
                this.jobs[index] = newRecord;
            }
        } else {
            // 添加新记录
            this.jobs.push(newRecord);
        }
        
        this.saveToLocalStorage();
        this.closeModal('recordModal');
        this.render();
    }

    openStatusModal(id) {
        const job = this.jobs.find(job => job.id === id);
        if (!job) return;
        
        document.getElementById('editRecordId').value = id;
        document.getElementById('updateStatus').value = job.status;
        
        // 如果是自定义状态，需要特殊处理
        if (!['已投递', '初面', '二面', '终面', 'Offer', '拒信'].includes(job.status)) {
            document.getElementById('updateStatus').value = 'other';
            document.getElementById('customUpdateStatus').value = job.status;
            document.getElementById('customUpdateStatus').style.display = 'block';
        } else {
            document.getElementById('customUpdateStatus').style.display = 'none';
        }
        
        document.getElementById('statusModal').style.display = 'block';
    }

    updateStatus() {
        const id = document.getElementById('editRecordId').value;
        let newStatus = document.getElementById('updateStatus').value;
        
        if (newStatus === 'other') {
            newStatus = document.getElementById('customUpdateStatus').value.trim();
            if (!newStatus) {
                alert('请输入自定义状态');
                return;
            }
        }
        
        const job = this.jobs.find(job => job.id === id);
        if (job) {
            // 检查状态是否真的改变了
            if (job.status !== newStatus) {
                // 添加到状态历史
                job.statusHistory.push({
                    status: newStatus,
                    timestamp: new Date().toLocaleString()
                });
                job.status = newStatus;
                
                this.saveToLocalStorage();
            }
        }
        
        this.closeModal('statusModal');
        this.render();
    }

    openDetailModal(id) {
        const job = this.jobs.find(job => job.id === id);
        if (!job) return;
        
        const detailDiv = document.getElementById('recordDetails');
        let statusHistoryHtml = '<h3>状态历史</h3><ul>';
        job.statusHistory.forEach((historyItem, index) => {
            statusHistoryHtml += `<li>${historyItem.status} (${historyItem.timestamp})</li>`;
        });
        statusHistoryHtml += '</ul>';
        
        detailDiv.innerHTML = `
            <div class="detail-item">
                <strong>公司名称:</strong> ${job.company}
            </div>
            <div class="detail-item">
                <strong>职位:</strong> ${job.position || '未填写'}
            </div>
            <div class="detail-item">
                <strong>投递时间:</strong> ${job.applicationDate}
            </div>
            <div class="detail-item">
                <strong>当前状态:</strong> 
                <span class="status-badge status-${job.status}">${job.status}</span>
            </div>
            <div class="detail-item">
                <strong>状态更新时间:</strong> ${job.statusHistory[job.statusHistory.length - 1].timestamp}
            </div>
            ${statusHistoryHtml}
        `;
        
        // 存储要删除的ID
        document.getElementById('deleteRecordBtn').dataset.deleteId = id;
        document.getElementById('detailModal').style.display = 'block';
    }

    deleteRecord() {
        const id = document.getElementById('deleteRecordBtn').dataset.deleteId;
        if (confirm('确定要删除这条记录吗？此操作不可撤销。')) {
            this.jobs = this.jobs.filter(job => job.id !== id);
            this.saveToLocalStorage();
            this.closeModal('detailModal');
            this.render();
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    render() {
        this.applyFilters();
        this.updateEmptyState();
        
        if (this.currentView === 'list') {
            this.renderList();
        } else if (this.currentView === 'gantt') {
            this.renderGanttChart();
        }
    }

    applyFilters() {
        const companyFilter = document.getElementById('companyFilter').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const startDateFilter = document.getElementById('startDateFilter').value;
        const endDateFilter = document.getElementById('endDateFilter').value;
        
        this.filteredJobs = this.jobs.filter(job => {
            // 公司名称过滤
            if (companyFilter && !job.company.toLowerCase().includes(companyFilter)) {
                return false;
            }
            
            // 状态过滤
            if (statusFilter && job.status !== statusFilter) {
                return false;
            }
            
            // 开始日期过滤
            if (startDateFilter && job.applicationDate < startDateFilter) {
                return false;
            }
            
            // 结束日期过滤
            if (endDateFilter && job.applicationDate > endDateFilter) {
                return false;
            }
            
            return true;
        });
    }

    updateEmptyState() {
        const emptyState = document.getElementById('emptyState');
        if (this.filteredJobs.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';
        }
    }

    renderList() {
        const tbody = document.getElementById('jobTableBody');
        tbody.innerHTML = '';
        
        this.filteredJobs.forEach(job => {
            const row = document.createElement('tr');
            
            // 获取最新的状态更新时间
            const latestStatusChange = job.statusHistory[job.statusHistory.length - 1].timestamp;
            
            row.innerHTML = `
                <td>${job.company}</td>
                <td>${job.position || '-'}</td>
                <td>${job.applicationDate}</td>
                <td>
                    <span class="status-badge status-${job.status}">${job.status}</span>
                </td>
                <td>${latestStatusChange}</td>
                <td>
                    <button onclick="app.openStatusModal('${job.id}')" class="btn-secondary">更新状态</button>
                    <button onclick="app.openDetailModal('${job.id}')" class="btn-secondary">详情</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    renderGanttChart() {
        const ganttContainer = document.getElementById('ganttChart');
        
        if (this.filteredJobs.length === 0) {
            ganttContainer.innerHTML = '<div class="empty-state"><p>暂无数据可显示在甘特图中</p></div>';
            return;
        }
        
        // 获取时间范围
        let minDate = new Date();
        let maxDate = new Date();
        
        this.filteredJobs.forEach(job => {
            const appDate = new Date(job.applicationDate);
            if (appDate < minDate) minDate = appDate;
            if (appDate > maxDate) maxDate = appDate;
            
            // 考虑状态历史中的日期
            job.statusHistory.forEach(history => {
                const statusDate = new Date(history.timestamp.split(' ')[0]);
                if (statusDate < minDate) minDate = statusDate;
                if (statusDate > maxDate) maxDate = statusDate;
            });
        });
        
        // 扩展时间范围以获得更好的视觉效果
        minDate.setDate(minDate.getDate() - 3);
        maxDate.setDate(maxDate.getDate() + 3);
        
        // 生成时间轴
        const timeSlots = [];
        const currentDate = new Date(minDate);
        while (currentDate <= maxDate) {
            timeSlots.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // 构建甘特图HTML
        let ganttHTML = `
            <div class="gantt-container">
                <div class="gantt-header">
                    <div class="gantt-company" style="min-width: 150px;">公司/职位</div>
                    <div class="gantt-time-axis">
        `;
        
        timeSlots.forEach(date => {
            ganttHTML += `<div class="time-slot">${date.getMonth()+1}/${date.getDate()}</div>`;
        });
        
        ganttHTML += `
                    </div>
                </div>
                <div class="gantt-body">
        `;
        
        this.filteredJobs.forEach(job => {
            ganttHTML += `
                <div class="gantt-row">
                    <div class="gantt-company" title="${job.company} - ${job.position}">
                        <div>${job.company}</div>
                        ${job.position ? `<div style="font-size: 0.8em; color: #777;">${job.position}</div>` : ''}
                    </div>
                    <div class="gantt-timeline" onclick="app.openDetailModal('${job.id}')">
            `;
            
            // 为每个状态历史项添加时间线项目
            job.statusHistory.forEach(history => {
                const statusDate = new Date(history.timestamp.split(' ')[0]);
                const dayIndex = timeSlots.findIndex(slot => 
                    slot.toDateString() === statusDate.toDateString()
                );
                
                if (dayIndex !== -1) {
                    const leftPercent = (dayIndex / timeSlots.length) * 100;
                    ganttHTML += `
                        <div class="timeline-item status-${history.status}" 
                             style="left: ${leftPercent}%; width: 40px;" 
                             title="${history.status} (${history.timestamp})">
                            ${history.status.charAt(0)}
                        </div>
                    `;
                }
            });
            
            ganttHTML += `
                    </div>
                </div>
            `;
        });
        
        ganttHTML += `
                </div>
            </div>
        `;
        
        ganttContainer.innerHTML = ganttHTML;
    }

    clearFilters() {
        document.getElementById('companyFilter').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('startDateFilter').value = '';
        document.getElementById('endDateFilter').value = '';
        this.render();
    }

    exportToCSV() {
        if (this.jobs.length === 0) {
            alert('没有数据可导出');
            return;
        }
        
        // CSV头部
        const headers = ['公司名称', '职位', '投递时间', '当前状态', '状态更新时间', '状态历史'];
        let csvContent = headers.join(',') + '\n';
        
        // 数据行
        this.jobs.forEach(job => {
            const statusHistoryStr = job.statusHistory.map(h => `${h.status}(${h.timestamp})`).join(';');
            const row = [
                `"${job.company}"`,
                `"${job.position}"`,
                `"${job.applicationDate}"`,
                `"${job.status}"`,
                `"${job.statusHistory[job.statusHistory.length - 1].timestamp}"`,
                `"${statusHistoryStr}"`
            ];
            csvContent += row.join(',') + '\n';
        });
        
        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `JobTrack_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    saveToLocalStorage() {
        localStorage.setItem('jobtrack_data', JSON.stringify(this.jobs));
    }
}

// 初始化应用
const app = new JobTrackApp();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 确保应用已初始化
    window.app = app;
});

// 点击模态框外部区域关闭模态框
window.onclick = function(event) {
    const modals = ['recordModal', 'statusModal', 'detailModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};