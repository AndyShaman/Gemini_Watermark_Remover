# 📦 Руководство по установке / Installation Guide

---

## 🇷🇺 Русская версия

### Быстрый старт (Расширение Chrome)

Следуйте этим простым шагам для установки и использования расширения Gemini Watermark Remover.

> ⚠️ **ВАЖНОЕ ПРИМЕЧАНИЕ**: Этот проект больше не использует Git LFS (Large File Storage) из-за ограничений по трафику. AI-модель должна быть загружена вручную (см. Шаг 2).

### Шаг 1: Получите код

Вам нужно использовать **Git** для загрузки этого проекта. Если у вас не установлен Git, [скачайте его здесь](https://git-scm.com/downloads) и установите (оставьте все настройки по умолчанию).

1. Откройте вашу **Терминал** (Командная строка или PowerShell на Windows, Терминал на Mac/Linux):
2. Клонируйте репозиторий:

```bash
git clone https://github.com/AndyShaman/Gemini_Watermark_Remover.git
```

**Альтернативный способ (без Git):**
- Нажмите зеленую кнопку **"Code"** на странице GitHub
- Выберите **"Download ZIP"**
- Распакуйте архив в папку на вашем компьютере, например, `Документы/Gemini-Watermark-Remover`

### Шаг 2: Скачайте AI-модель (Обязательно)

Так как Git LFS больше не используется в этом проекте, вы должны скачать AI-модель вручную. **Расширение не будет работать без этого файла.**

**Скачайте модель (`lama_fp32.onnx`):**

👉 [Нажмите здесь для скачивания с Google Drive](https://drive.google.com/file/d/16cRZWEQyJFecg77ebUBXjFxAik0iFU_C/view?usp=sharing)

**Разместите файл:**

Переместите скачанный файл `lama_fp32.onnx` в папку `src/assets/` внутри директории проекта.

Структура папок должна выглядеть так:

```
Gemini-Watermark-Remover/
├── src/
│   ├── assets/
│   │   └── lama_fp32.onnx  <-- Файл должен быть здесь (примерно 200 МБ)
│   └── ...
├── manifest.json
└── ...
```

### Шаг 3: Загрузите расширение в Chrome

1. Откройте **Google Chrome**
2. Перейдите в `chrome://extensions/` (или Меню → Расширения → Управление расширениями)
3. Включите **Режим разработчика** переключателем в правом верхнем углу
4. Нажмите кнопку **"Загрузить распакованное расширение"** ("Load unpacked")
5. Выберите папку `Gemini-Watermark-Remover` (убедитесь, что она содержит файл `manifest.json`)
6. Иконка расширения должна появиться на панели инструментов Chrome

### Шаг 4: Используйте расширение

1. Нажмите на иконку **Gemini Watermark Remover** на панели инструментов
2. Откроется новая вкладка с интерфейсом приложения
3. Перетащите изображение с водяным знаком Gemini или нажмите для выбора файла
4. **Выделите кистью область водяного знака** - используйте инструмент кисти, чтобы закрасить область, где находится водяной знак
5. **Подкорректируйте выделение** при необходимости - используйте ластик, масштабирование (zoom) и панорамирование (pan)
6. **Нажмите кнопку "Удалить водяной знак"** - AI обработает только выделенную область (прогресс-бар покажет статус)
7. После завершения используйте слайдер для сравнения результатов "до/после"
8. Нажмите **"Download Image"** для сохранения очищенного изображения

## Устранение неполадок

### Расширение не загружается

- **Ошибка**: "Could not load icon" (Не удалось загрузить иконку)
  - **Решение**: Убедитесь, что вы полностью распаковали ZIP-архив. Папка `icons/` должна содержать файлы `icon16.png`, `icon48.png` и `icon128.png`.

- **Ошибка**: "Manifest file is missing or unreadable" (Файл манифеста отсутствует или нечитаем)
  - **Решение**: Убедитесь, что вы выбрали правильную папку (ту, которая содержит `manifest.json`, а не родительскую папку).

### Обработка не работает

- **Ошибка**: "Failed to load AI model" / "File not found" (Не удалось загрузить AI-модель / Файл не найден)
  - **Решение**: Вы пропустили Шаг 2. Файл `lama_fp32.onnx` отсутствует в папке `src/assets/`. Скачайте его по ссылке выше и поместите туда.

- **Ошибка**: "File size exceeds limit" (Размер файла превышает лимит)
  - **Решение**: Максимальный размер файла составляет 50 МБ. Попробуйте сначала сжать ваше изображение.

### Проблемы с производительностью

- Если обработка происходит медленно, закройте другие вкладки Chrome для освобождения памяти
- Первый запуск будет медленнее, так как модель инициализируется; последующие запуски будут быстрее

## Системные требования

- **Браузер**: Google Chrome (версия 90+) или браузеры на основе Chromium
- **ОЗУ**: Минимум 4 ГБ рекомендуется (8 ГБ для оптимальной производительности)
- **Дисковое пространство**: ~250 МБ для расширения и модели
- **Интернет**: Требуется для первоначального скачивания файла модели с Google Drive

## Примечание о конфиденциальности

Вся обработка происходит локально в вашем браузере. Никакие изображения или данные не отправляются на какие-либо внешние серверы. Вы можете проверить это, открыв вкладку Network в Chrome DevTools во время использования расширения.

## Удаление расширения

Чтобы удалить расширение:

1. Перейдите в `chrome://extensions/`
2. Найдите "Gemini Watermark Remover"
3. Нажмите **"Удалить"** ("Remove")
4. Удалите папку с проектом с вашего компьютера

## Нужна помощь?

Если вы столкнулись с проблемами, которые не описаны здесь, пожалуйста:

1. Проверьте [README.md](README.md) для дополнительной информации
2. Откройте issue в [GitHub репозитории](https://github.com/AndyShaman/Gemini_Watermark_Remover/issues)

---

## 🇬🇧 English Version

### Quick Start (Chrome Extension)

Follow these simple steps to install and use the Gemini Watermark Remover extension.

> ⚠️ **IMPORTANT NOTE**: This project no longer uses Git LFS (Large File Storage) due to bandwidth quotas. The AI model must be downloaded manually (see Step 2).

### Step 1: Get the Code

You need to use **Git** to download this project. If you don't have Git installed, [download it here](https://git-scm.com/downloads) and install it (keep all default settings).

1. Open your **Terminal** (Command Prompt or PowerShell on Windows, Terminal on Mac/Linux):
2. Clone the repository:

```bash
git clone https://github.com/AndyShaman/Gemini_Watermark_Remover.git
```

**Alternative method (without Git):**
- Click the green **"Code"** button on the GitHub page
- Select **"Download ZIP"**
- Extract it to a folder on your computer, e.g., `Documents/Gemini-Watermark-Remover`

### Step 2: Download the AI Model (Required)

Since Git LFS is obsolete for this project, you must download the AI model manually. **The extension will not work without this file.**

**Download the model (`lama_fp32.onnx`):**

👉 [Click here to download from Google Drive](https://drive.google.com/file/d/16cRZWEQyJFecg77ebUBXjFxAik0iFU_C/view?usp=sharing)

**Place the file:**

Move the downloaded `lama_fp32.onnx` file into the `src/assets/` folder inside the project directory.

Your folder structure must look like this:

```
Gemini-Watermark-Remover/
├── src/
│   ├── assets/
│   │   └── lama_fp32.onnx  <-- The file goes here (approx. 200MB)
│   └── ...
├── manifest.json
└── ...
```

### Step 3: Load the Extension in Chrome

1. Open **Google Chrome**
2. Navigate to `chrome://extensions/` (or go to Menu → Extensions → Manage Extensions)
3. Enable **Developer mode** by toggling the switch in the top-right corner
4. Click the **"Load unpacked"** button
5. Select the `Gemini-Watermark-Remover` folder (ensure it contains `manifest.json`)
6. The extension icon should now appear in your Chrome toolbar

### Step 4: Use the Extension

1. Click the **Gemini Watermark Remover** icon in your toolbar
2. A new tab will open with the application interface
3. Drag and drop an image with a Gemini watermark, or click to browse
4. **Mark the watermark area with the brush** - use the brush tool to paint over the area where the watermark is located
5. **Refine your selection** if needed - use the eraser, zoom, and pan controls for precision
6. **Click the "Remove Watermark" button** - AI will process only the selected area (progress bar will show status)
7. Once complete, use the before/after slider to compare results
8. Click **"Download Image"** to save the cleaned image

## Troubleshooting

### Extension doesn't load

- **Error**: "Could not load icon"
  - **Solution**: Make sure you extracted the ZIP file completely. The `icons/` folder must contain `icon16.png`, `icon48.png`, and `icon128.png`.

- **Error**: "Manifest file is missing or unreadable"
  - **Solution**: Ensure you selected the correct folder (the one containing `manifest.json`, not a parent folder).

### Processing fails

- **Error**: "Failed to load AI model" / "File not found"
  - **Solution**: You missed Step 2. The `lama_fp32.onnx` file is missing from `src/assets/`. Download it from the link above and place it there.

- **Error**: "File size exceeds limit"
  - **Solution**: The maximum file size is 50 MB. Try compressing your image first.

### Performance issues

- If processing is slow, close other Chrome tabs to free up memory
- The first run will be slower as the model initializes; subsequent runs will be faster

## System Requirements

- **Browser**: Google Chrome (version 90+) or Chromium-based browsers
- **RAM**: At least 4 GB recommended (8 GB for optimal performance)
- **Storage**: ~250 MB for the extension and model
- **Internet**: Required to download the initial model file from Google Drive

## Privacy Note

All processing happens locally in your browser. No images or data are sent to any external server. You can verify this by checking the Network tab in Chrome DevTools while using the extension.

## Uninstallation

To remove the extension:

1. Go to `chrome://extensions/`
2. Find "Gemini Watermark Remover"
3. Click **"Remove"**
4. Delete the extracted folder from your computer

## Need Help?

If you encounter any issues not covered here, please:

1. Check the [README.md](README.md) for more information
2. Open an issue on the [GitHub repository](https://github.com/AndyShaman/Gemini_Watermark_Remover/issues)
