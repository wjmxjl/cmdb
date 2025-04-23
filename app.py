from flask import Flask, render_template, request, jsonify
import pandas as pd
from datetime import datetime
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# 确保上传文件夹存在
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

def format_date(date_value):
    """格式化日期值"""
    if pd.isna(date_value):
        return None
    try:
        if isinstance(date_value, str):
            # 尝试解析字符串日期
            return datetime.strptime(date_value, '%Y-%m-%d').strftime('%Y-%m-%d')
        elif isinstance(date_value, (pd.Timestamp, datetime)):
            # 直接格式化日期对象
            return date_value.strftime('%Y-%m-%d')
        return None
    except:
        return None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files and 'file' not in request.form:
        return jsonify({'error': '没有文件被上传'}), 400
    
    try:
        if 'file' in request.files:
            # 处理新上传的文件
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': '没有选择文件'}), 400
            
            if not file.filename.endswith(('.xlsx', '.xls')):
                return jsonify({'error': '不支持的文件类型'}), 400
            
            # 保存文件
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filepath)
        else:
            # 处理历史文件
            filename = request.form['file']
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            if not os.path.exists(filepath):
                return jsonify({'error': '文件不存在'}), 404
        
        # 读取Excel文件
        df = pd.read_excel(filepath)
        
        # 验证必要的列是否存在
        required_columns = ['设备名称', '设备编号', '管理IP', '设备类型', '品牌', 
                          '机房编号', '机柜编号', '开始U数', '截止U数', 
                          '序列号', '维保开始日期', '维保结束日期']
        
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            return jsonify({'error': f'缺少必要的列: {", ".join(missing_columns)}'}), 400
        
        # 处理数据
        devices = []
        for _, row in df.iterrows():
            device = {
                'name': str(row['设备名称']),
                'id': str(row['设备编号']),
                'ip': str(row['管理IP']),
                'type': str(row['设备类型']),
                'brand': str(row['品牌']),
                'room': str(row['机房编号']),
                'cabinet': str(row['机柜编号']),
                'start_u': int(row['开始U数']),
                'end_u': int(row['截止U数']),
                'serial': str(row['序列号']),
                'warranty_start': format_date(row['维保开始日期']),
                'warranty_end': format_date(row['维保结束日期'])
            }
            devices.append(device)
        
        return jsonify({'devices': devices})
        
    except Exception as e:
        return jsonify({'error': f'处理文件时出错: {str(e)}'}), 500

@app.route('/get_history_files', methods=['GET'])
def get_history_files():
    try:
        files = os.listdir(app.config['UPLOAD_FOLDER'])
        # 只返回Excel文件
        excel_files = [f for f in files if f.endswith(('.xlsx', '.xls'))]
        return jsonify({'files': excel_files})
    except Exception as e:
        return jsonify({'error': f'获取历史文件列表失败: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001) 