let devices = [];

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileInput = document.getElementById('excelFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showAlert('请选择文件', 'danger');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            devices = data.devices;
            updateCabinetSelect();
            showAlert('文件上传成功', 'success');
        } else {
            showAlert(data.error, 'danger');
        }
    } catch (error) {
        showAlert('上传失败：' + error.message, 'danger');
    }
});

function updateCabinetSelect() {
    const select = document.getElementById('cabinetSelect');
    const cabinets = [...new Set(devices.map(device => device.cabinet))].sort((a, b) => {
        // 使用正则表达式匹配字母和数字部分
        const aMatch = a.match(/^([A-Za-z]+)(\d+)$/);
        const bMatch = b.match(/^([A-Za-z]+)(\d+)$/);
        
        if (aMatch && bMatch) {
            const aLetter = aMatch[1].toUpperCase(); // 转换为大写进行比较
            const bLetter = bMatch[1].toUpperCase();
            const aNumber = parseInt(aMatch[2], 10);
            const bNumber = parseInt(bMatch[2], 10);
            
            // 先比较字母部分
            if (aLetter < bLetter) return -1;
            if (aLetter > bLetter) return 1;
            
            // 字母相同则比较数字部分
            return aNumber - bNumber;
        }
        
        // 如果格式不匹配，则按字符串比较
        return a.localeCompare(b);
    });
    
    // 清空现有选项
    select.innerHTML = '<option value="">请选择机柜</option>';
    
    // 添加新的选项
    cabinets.forEach(cabinet => {
        const option = document.createElement('option');
        option.value = cabinet;
        option.textContent = cabinet;
        select.appendChild(option);
    });
}

document.getElementById('cabinetSelect').addEventListener('change', (e) => {
    const cabinetNumber = e.target.value;
    if (cabinetNumber) {
        renderCabinet(cabinetNumber);
    }
});

function renderCabinet(cabinetNumber) {
    const cabinetView = document.getElementById('cabinetView');
    cabinetView.innerHTML = '';
    
    // 创建主容器
    const mainContainer = document.createElement('div');
    mainContainer.className = 'main-container';
    
    // 创建机柜区域
    const cabinetSection = document.createElement('div');
    cabinetSection.className = 'cabinet-section';
    
    // 添加机柜标题
    const title = document.createElement('div');
    title.className = 'cabinet-title';
    title.textContent = `机柜编号: ${cabinetNumber}`;
    cabinetSection.appendChild(title);
    
    // 创建机柜视图
    const cabinetContainer = document.createElement('div');
    cabinetContainer.className = 'cabinet-container';
    
    // 创建设备详情区域
    const deviceDetailsSection = document.createElement('div');
    deviceDetailsSection.className = 'device-details-section';
    
    const deviceDetails = document.createElement('div');
    deviceDetails.className = 'device-details';
    deviceDetails.innerHTML = '<h3>设备详情</h3><p>点击设备查看详细信息</p>';
    deviceDetailsSection.appendChild(deviceDetails);
    
    // 获取该机柜的所有设备
    const cabinetDevices = devices.filter(device => device.cabinet === cabinetNumber);
    
    // 创建42U机柜（标准机柜高度）
    for (let i = 42; i >= 1; i--) {
        const unit = document.createElement('div');
        unit.className = 'cabinet-unit';
        unit.innerHTML = `<span class="cabinet-unit-number">${i}U</span>`;
        
        // 查找占用这个U位的设备
        const device = cabinetDevices.find(d => d.start_u <= i && d.end_u >= i);
        if (device) {
            // 如果是设备的第一个U位，创建设备元素
            if (i === device.end_u) {
                const deviceElement = document.createElement('div');
                deviceElement.className = 'device';
                deviceElement.textContent = `${device.name} (${device.type})`;
                
                // 添加点击事件
                deviceElement.addEventListener('click', () => {
                    // 更新设备详情区域
                    deviceDetails.innerHTML = `
                        <h3>${device.name} 详细信息</h3>
                        <p><strong>设备名称：</strong>${device.name}</p>
                        <p><strong>设备编号：</strong>${device.id}</p>
                        <p><strong>管理IP：</strong>${device.ip || '未设置'}</p>
                        <p><strong>设备类型：</strong>${device.type}</p>
                        <p><strong>品牌：</strong>${device.brand}</p>
                        <p><strong>序列号：</strong>${device.serial}</p>
                        <p><strong>维保开始：</strong>${device.warranty_start || '未设置'}</p>
                        <p><strong>维保结束：</strong>${device.warranty_end || '未设置'}</p>
                        <p><strong>位置：</strong>${device.start_u}U - ${device.end_u}U</p>
                    `;
                });
                
                unit.appendChild(deviceElement);
                
                // 设置设备背景色
                unit.style.backgroundColor = getDeviceColor(device.type);
                
                // 如果是多U设备，添加合并样式
                if (device.end_u - device.start_u > 0) {
                    unit.style.borderBottom = 'none';
                    unit.style.marginBottom = '0';
                }
            } else if (i === device.start_u) {
                // 如果是设备的最后一个U位
                unit.style.borderTop = 'none';
                unit.style.marginTop = '0';
                unit.style.backgroundColor = getDeviceColor(device.type);
            } else {
                // 如果是设备的中间U位
                unit.style.borderTop = 'none';
                unit.style.borderBottom = 'none';
                unit.style.marginTop = '0';
                unit.style.marginBottom = '0';
                unit.style.backgroundColor = getDeviceColor(device.type);
            }
        }
        
        cabinetContainer.appendChild(unit);
    }
    
    // 将机柜视图添加到机柜区域
    cabinetSection.appendChild(cabinetContainer);
    
    // 将机柜区域和设备详情区域添加到主容器
    mainContainer.appendChild(cabinetSection);
    mainContainer.appendChild(deviceDetailsSection);
    
    // 将主容器添加到页面
    cabinetView.appendChild(mainContainer);
}

function getDeviceColor(deviceType) {
    // 根据设备类型返回不同的颜色
    const colors = {
        '服务器': '#e3f2fd',
        '交换机': '#e8f5e9',
        '路由器': '#fff3e0',
        '防火墙': '#fce4ec',
        '存储设备': '#f3e5f5'
    };
    return colors[deviceType] || '#ffffff';
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // 5秒后自动消失
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// 加载历史文件列表
async function loadHistoryFiles() {
    try {
        const response = await fetch('/get_history_files');
        const data = await response.json();
        
        if (response.ok) {
            const select = document.getElementById('historyFiles');
            // 清空现有选项
            select.innerHTML = '<option value="">请选择历史文件</option>';
            
            // 添加历史文件选项
            data.files.forEach(file => {
                const option = document.createElement('option');
                option.value = file;
                option.textContent = file;
                select.appendChild(option);
            });
        } else {
            showAlert(data.error, 'danger');
        }
    } catch (error) {
        showAlert('获取历史文件列表失败：' + error.message, 'danger');
    }
}

// 页面加载时获取历史文件列表
document.addEventListener('DOMContentLoaded', loadHistoryFiles);

// 监听历史文件选择变化
document.getElementById('historyFiles').addEventListener('change', async (e) => {
    const selectedFile = e.target.value;
    if (!selectedFile) return;
    
    try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            devices = data.devices;
            updateCabinetSelect();
            showAlert('文件加载成功', 'success');
        } else {
            showAlert(data.error, 'danger');
        }
    } catch (error) {
        showAlert('加载文件失败：' + error.message, 'danger');
    }
}); 