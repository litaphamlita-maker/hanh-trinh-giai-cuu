# Hành Trình Giải Cứu Đồng Đội — GitHub Pages

Game HTML/CSS/JavaScript thuần, có thể chạy trực tiếp bằng GitHub Pages.

## Cấu trúc

```text
.
├── index.html
├── style.css
├── game.js
├── data/
│   └── questions.json   <-- CHỈNH CÂU HỎI Ở ĐÂY
└── assets/
    ├── forest-reference.png
    ├── hero.svg
    ├── snake.svg
    ├── giant.svg
    └── friend.svg
```

## Luật game

- 12 chặng.
- 10 máu ban đầu.
- Trả lời đúng: rắn biến mất, không mất máu.
- Trả lời sai: mất 1 máu và xuất hiện hiệu ứng dấu cắn.
- Hết 0 máu trước chặng 12: Game Over.
- Vượt qua chặng 12 còn máu: nhận gươm, chặt dây, cứu đồng đội.
- Sau khi cứu: màn hình chiến thắng.

## Cách thay câu hỏi

Mở:

`data/questions.json`

Mỗi chặng có dạng:

```json
{
  "stage": 1,
  "question": "Nội dung câu hỏi",
  "options": [
    "Đáp án A",
    "Đáp án B",
    "Đáp án C",
    "Đáp án D"
  ],
  "correct": 1,
  "explanationCorrect": "Lời giải thích khi đúng",
  "explanationWrong": "Lời giải thích khi sai"
}
```

`correct` dùng số:
- `0` = A
- `1` = B
- `2` = C
- `3` = D

## Đưa lên GitHub

1. Tạo repository Public.
2. Upload toàn bộ file/thư mục này, giữ nguyên cấu trúc.
3. Vào `Settings → Pages`.
4. `Source = Deploy from a branch`.
5. `Branch = main`, folder = `/ (root)`.
6. Save và chờ GitHub Pages xuất bản.

## Lưu ý

Không mở `index.html` bằng cách double-click nếu trình duyệt chặn `fetch()` file JSON. Hãy chạy qua GitHub Pages hoặc một local server.

Game không cần backend/database. Vì vậy câu hỏi và đáp án đang nằm trong file JSON công khai.
