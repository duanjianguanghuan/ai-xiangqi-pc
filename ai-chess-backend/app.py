from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
import uuid

app = Flask(__name__)
CORS(app)

# 模拟数据库
users = {}
game_records = {}

# 主页
@app.route('/')
def index():
    return jsonify({"message": "AI 象棋后端 API"})

# 用户注册
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data or 'username' not in data:
        return jsonify({"error": "缺少必填字段"}), 400
    
    email = data['email']
    if email in users:
        return jsonify({"error": "邮箱已存在"}), 400
    
    user_id = str(uuid.uuid4())
    users[email] = {
        "id": user_id,
        "email": email,
        "password": data['password'],
        "username": data['username'],
        "avatar": None,
        "join_date": "2026-04-01"
    }
    
    return jsonify({"user": users[email], "token": "mock-token"})

# 用户登录
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "缺少邮箱和密码"}), 400
    
    email = data['email']
    password = data['password']
    
    if email not in users or users[email]['password'] != password:
        return jsonify({"error": "邮箱或密码错误"}), 401
    
    return jsonify({"user": users[email], "token": "mock-token"})

# 创建游戏
@app.route('/api/game/create', methods=['POST'])
def create_game():
    data = request.get_json()
    if not data or 'mode' not in data:
        return jsonify({"error": "缺少游戏模式"}), 400
    
    game_id = str(uuid.uuid4())
    game_records[game_id] = {
        "id": game_id,
        "mode": data['mode'],
        "difficulty": data.get('difficulty', 2),
        "status": "in_progress",
        "moves": [],
        "created_at": "2026-04-22"
    }
    
    return jsonify({"gameId": game_id})

# 获取历史对局
@app.route('/api/game/history', methods=['GET'])
def get_history():
    # 模拟历史对局数据
    history = [
        {
            "id": "1",
            "date": "2026-04-22",
            "mode": "人机对弈",
            "difficulty": "中等",
            "result": "胜利",
            "opponent": "AI",
            "moves": 45
        },
        {
            "id": "2",
            "date": "2026-04-21",
            "mode": "在线对战",
            "difficulty": "-",
            "result": "失败",
            "opponent": "ChessMaster",
            "moves": 38
        },
        {
            "id": "3",
            "date": "2026-04-20",
            "mode": "人机对弈",
            "difficulty": "困难",
            "result": "胜利",
            "opponent": "AI",
            "moves": 52
        }
    ]
    
    return jsonify({"games": history})

# 获取用户信息
@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    # 模拟用户信息
    user = {
        "username": "象棋爱好者",
        "email": "user@example.com",
        "avatar": "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chess%20player%20avatar%20profile%20picture&image_size=square",
        "joinDate": "2026-04-01",
        "totalGames": 25,
        "wins": 15,
        "losses": 8,
        "draws": 2
    }
    
    return jsonify({"user": user})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)