# ✨ Gemini Watermark Remover

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Version](https://img.shields.io/badge/version-3.0.0-blue.svg)](https://github.com/AndyShaman/Gemini_Watermark_Remover)
[![Platform](https://img.shields.io/badge/platform-Chrome-brightgreen.svg)](https://www.google.com/chrome/)

> **Fork проекта** [dinoBOLT/Gemini-Watermark-Remover](https://github.com/dinoBOLT/Gemini-Watermark-Remover)
> Этот репозиторий является форком оригинального проекта с дополнительными улучшениями и русскоязычной документацией.

---

## 🇷🇺 Описание на русском

**Профессиональное расширение Chrome для удаления водяных знаков с изображений, созданных Google Gemini. Работает полностью локально в вашем браузере, гарантируя 100% конфиденциальность.**

Этот инструмент предоставляет удобный интерфейс для обработки ваших изображений. Никакие данные не отправляются на внешние серверы - ваша конфиденциальность полностью защищена.

### 🌟 Основные возможности

- **100% локальная обработка**: Вся обработка происходит прямо в вашем браузере. Ваши изображения никогда не покидают компьютер.
- **Ручное выделение области**: Полный контроль над процессом - вы сами выбираете кистью область водяного знака для удаления, что обеспечивает максимальную точность.
- **Инструменты редактирования**: Кисть для выделения, ластик для коррекции, масштабирование (zoom) и панорамирование (pan) для удобной и точной работы.
- **Высококачественная AI-обработка**: Использует мощную модель LaMa (Large Mask Inpainting) для интеллектуального удаления водяного знака с естественным восстановлением фона.
- **Сохранение оригинального качества**: Изменяется только выделенная вами область. Остальная часть изображения остается идеально нетронутой.
- **Современный интерфейс**: Элегантный, отзывчивый интерфейс с поддержкой drag-and-drop, прогресс-баром в реальном времени и подробными логами.
- **Сравнение "До/После"**: Интерактивный слайдер позволяет мгновенно сравнить оригинальное и очищенное изображение.
- **Эффективная работа**: AI-модель загружается один раз и кешируется для последующего использования. Модульная архитектура обеспечивает плавную работу.
- **Открытый исходный код**: Полностью прозрачный проект, открытый для вклада сообщества.

### 🖼️ Скриншот

<img width="1228" height="893" alt="image" src="https://github.com/user-attachments/assets/6cd5ca2a-3c53-44b4-8ff4-0563e3aae102" />

### 🚀 Установка

Расширение распространяется в виде неупакованного расширения и требует ручной установки.

👉 **Пожалуйста, прочитайте файл [INSTALLATION.md](INSTALLATION.md) для получения полных пошаговых инструкций по установке проекта.**

### 🛠️ Как использовать

1. Нажмите на иконку **Gemini Watermark Remover** на панели инструментов Chrome. Откроется приложение в новой вкладке.
2. **Перетащите** файл изображения, созданного Gemini, в указанную область или нажмите для выбора файла.
3. **Выделите область водяного знака кистью**: После загрузки изображения используйте инструмент кисти, чтобы вручную закрасить область, где находится водяной знак.
4. **Подкорректируйте выделение**: При необходимости подотрите края или добавьте дополнительные участки для более точного выделения. Используйте инструменты масштабирования (zoom) и панорамирования (pan) для удобства.
5. **Нажмите кнопку "Удалить водяной знак"**: После того как вы выделили нужную область, нажмите кнопку для запуска AI-обработки. Приложение обработает только выделенную вами область.
6. После завершения очищенное изображение будет отображено с **слайдером сравнения "до/после"**.
7. Нажмите кнопку **"Download Image"**, чтобы сохранить финальное изображение без водяного знака на ваш компьютер.
8. Для обработки другого изображения просто нажмите **"Process Another"**.

### ⚙️ Архитектура проекта

Проект построен на современной модульной JavaScript архитектуре для обеспечения поддерживаемости и производительности.

- **`index.html`**: Главный интерфейс приложения.
- **`styles.css`**: Все стили пользовательского интерфейса.
- **`manifest.json`**: Определяет свойства и разрешения расширения Chrome.
- **`background.js`**: Service worker, обрабатывающий клик по иконке расширения.
- **`src/`**: Содержит всю основную логику приложения.
    - **`lib/`**: Библиотека ONNX Runtime и необходимые WASM файлы.
    - **`assets/`**: Файл AI-модели `lama_fp32.onnx`.
    - **`js/`**: Модульный JavaScript исходный код.
        - **`app.js`**: Главная точка входа приложения, координирующая весь процесс.
        - **`config.js`**: Централизованный файл конфигурации для всех настроек и констант.
        - **`ui-manager.js`**: Управляет всеми DOM взаимодействиями, обновлениями UI и обратной связью с пользователем.
        - **`model-manager.js`**: Обрабатывает загрузку ONNX модели, выполнение инференса и кеширование.
        - **`image-processor.js`**: Содержит логику предобработки, постобработки и финальной композиции изображений.
        - **`utils.js`**: Коллекция вспомогательных функций для валидации, логирования и прочего.

### 🔒 Конфиденциальность

Конфиденциальность является основным принципом проектирования. Весь процесс, от загрузки изображения до запуска AI-модели и генерации финального результата, происходит в изолированной среде вашего браузера. **Никакие данные, изображения или информация никогда не передаются на какие-либо внешние серверы.**

### 📜 Благодарности

Этот проект стал возможным благодаря этим невероятным open-source технологиям:

- **LaMa Model**: Модель inpainting основана на [Resolution-robust Large Mask Inpainting with Fourier Convolutions](https://github.com/advimman/lama).
- **ONNX Runtime**: AI-модель выполняется в браузере с использованием [ONNX Runtime Web](https://onnxruntime.ai/).
- **Оригинальный проект**: [dinoBOLT/Gemini-Watermark-Remover](https://github.com/dinoBOLT/Gemini-Watermark-Remover)

### 📄 Лицензия

Этот проект лицензирован под **Apache License 2.0**. Подробности смотрите в файле [LICENSE](LICENSE).

### 🤝 Вклад в проект

Приветствуются любые вклады! Не стесняйтесь открывать issue или отправлять pull request. См. файл [CONTRIBUTING.md](CONTRIBUTING.md) для руководства.

---

## 🇬🇧 English Description

**A professional, privacy-focused Chrome extension to remove watermarks from images generated by Google Gemini, running 100% locally in your browser.**

This tool provides a clean, standalone interface to process your images. No data is ever sent to an external server, ensuring your privacy is fully protected.

### 🌟 Key Features

- **100% Local & Private**: All processing happens directly in your browser. Your images never leave your computer.
- **Manual Area Selection**: Full control over the process - you manually select the watermark area with a brush tool, ensuring maximum precision.
- **Editing Tools**: Brush for selection, eraser for correction, zoom and pan controls for comfortable and accurate work.
- **High-Quality AI Processing**: Uses the powerful LaMa (Large Mask Inpainting) model to intelligently remove watermarks with natural background restoration.
- **Preserves Original Quality**: Only the area you select is modified. The rest of your image remains pixel-perfect and untouched.
- **Modern & Intuitive UI**: A sleek, responsive interface with drag-and-drop support, a real-time progress bar, and detailed logs.
- **Before & After Comparison**: An interactive slider lets you instantly compare the original and cleaned images to see the results.
- **Efficient Performance**: The AI model is loaded once and cached for subsequent uses. A modular architecture ensures a smooth user experience.
- **Open Source**: Fully transparent and open for community contributions.

### 🚀 Installation

This extension is distributed as an unpacked extension and requires a manual installation process.

👉 **Please read the [INSTALLATION.md](INSTALLATION.md) file for complete, step-by-step instructions on how to set up the project.**

### 🛠️ How to Use

1. Click the **Gemini Watermark Remover** icon in your Chrome toolbar. This will open the application in a new tab.
2. **Drag and drop** an image file generated by Gemini into the designated area, or click to browse your files.
3. **Mark the watermark area with the brush**: After loading the image, use the brush tool to manually paint over the area where the watermark is located.
4. **Refine your selection**: If needed, erase edges or add additional areas for more precise selection. Use the zoom and pan controls for better accuracy.
5. **Click the "Remove Watermark" button**: Once you've marked the desired area, click the button to start AI processing. The application will process only the area you've selected.
6. Once complete, the cleaned image will be displayed with a **before/after comparison slider**.
7. Click the **"Download Image"** button to save the final, watermark-free image to your computer.
8. To process another image, simply click **"Process Another"**.

### ⚙️ Project Architecture

This project is built with a modern, modular JavaScript architecture to ensure maintainability and performance.

- **`index.html`**: The main application interface.
- **`styles.css`**: All styles for the user interface.
- **`manifest.json`**: Defines the Chrome extension's properties and permissions.
- **`background.js`**: A service worker that handles the extension's icon click.
- **`src/`**: Contains all the core application logic.
    - **`lib/`**: The ONNX Runtime library and its required WASM files.
    - **`assets/`**: The `lama_fp32.onnx` AI model file.
    - **`js/`**: The modular JavaScript source code.
        - **`app.js`**: The main application entry point that orchestrates the entire process.
        - **`config.js`**: A centralized configuration file for all settings and constants.
        - **`ui-manager.js`**: Manages all DOM interactions, UI updates, and user feedback.
        - **`model-manager.js`**: Handles loading the ONNX model, running inference, and caching.
        - **`image-processor.js`**: Contains logic for image preprocessing, postprocessing, and final composition.
        - **`utils.js`**: A collection of helper functions for validation, logging, and more.

### 🔒 Privacy

Privacy is a core design principle of this project. The entire process, from loading the image to running the AI model and generating the final result, happens within a sandboxed environment in your browser. **No data, images, or information is ever transmitted to any external server.**

### 📜 Credits

This project is made possible by these incredible open-source technologies:

- **LaMa Model**: The inpainting model is based on [Resolution-robust Large Mask Inpainting with Fourier Convolutions](https://github.com/advimman/lama).
- **ONNX Runtime**: The AI model is executed in the browser using [ONNX Runtime Web](https://onnxruntime.ai/).
- **Original Project**: [dinoBOLT/Gemini-Watermark-Remover](https://github.com/dinoBOLT/Gemini-Watermark-Remover)

### 📄 License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.

### 🤝 Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request. See the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.
