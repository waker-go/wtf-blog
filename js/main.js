// ========================================
// 性能优化 - 图片懒加载
// ========================================
function initLazyLoading() {
    // 使用Intersection Observer API实现图片懒加载
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.add('loaded');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        // 观察所有带有data-src属性的图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 降级方案：直接加载所有图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// ========================================
// 性能优化 - 防抖和节流
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 初始化图片懒加载
    initLazyLoading();
    
    // 初始化AOS动画库 - 增强配置
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: false,
            mirror: true,
            offset: 100,
            delay: 100
        });
    }

    // 主题切换功能
    initThemeSwitcher();

    // 初始化所有特效
    initCursorEffects();
    initRippleEffect();
    initScrollProgress();
    initParticles();
    initPageLoader();

    // 樱花飘落效果
    function createCherryBlossoms() {
        const body = document.body;
        const cherryContainer = document.createElement('div');
        cherryContainer.className = 'cherry-blossom-container';
        body.appendChild(cherryContainer);

        // 创建50个樱花
        for (let i = 0; i < 50; i++) {
            createCherryBlossom(cherryContainer);
        }

        // 每隔200ms创建一个新的樱花
        setInterval(() => {
            createCherryBlossom(cherryContainer);
            // 限制最大数量
            if (cherryContainer.children.length > 100) {
                cherryContainer.removeChild(cherryContainer.children[0]);
            }
        }, 200);
    }

    function createCherryBlossom(container) {
        const blossom = document.createElement('div');
        blossom.className = 'cherry-blossom';

        // 随机大小
        const size = Math.random() * 15 + 5;
        blossom.style.width = `${size}px`;
        blossom.style.height = `${size}px`;

        // 随机位置
        blossom.style.left = `${Math.random() * 100}%`;

        // 随机透明度
        blossom.style.opacity = Math.random() * 0.6 + 0.4;

        // 随机旋转
        blossom.style.transform = `rotate(${Math.random() * 360}deg)`;

        // 随机动画持续时间
        const duration = Math.random() * 10 + 5;
        blossom.style.animationDuration = `${duration}s, ${duration / 2}s, ${duration / 3}s`;

        // 随机延迟
        blossom.style.animationDelay = `${Math.random() * 5}s`;

        // 添加到容器
        container.appendChild(blossom);

        // 动画结束后移除
        setTimeout(() => {
            if (container.contains(blossom)) {
                container.removeChild(blossom);
            }
        }, duration * 1000);
    }

    // 背景Canvas效果
    function createBackgroundEffect() {
        const canvas = document.createElement('canvas');
        canvas.className = 'background-canvas';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        // 粒子数组
        const particles = [];
        const particleCount = 100;

        // 创建粒子
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                color: `rgba(255, ${Math.floor(Math.random() * 100) + 156}, ${Math.floor(Math.random() * 100) + 156}, ${Math.random() * 0.5 + 0.1})`,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }

        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // 更新和绘制粒子
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // 移动粒子
                p.x += p.speedX;
                p.y += p.speedY;

                // 边界检查
                if (p.x < 0 || p.x > width) p.speedX *= -1;
                if (p.y < 0 || p.y > height) p.speedY *= -1;

                // 绘制粒子
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();

                // 连接附近的粒子
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 156, 218, ${0.1 * (1 - distance / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        // 窗口大小改变时调整Canvas大小
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // 开始动画
        animate();
    }

    // 创建樱花飘落效果
    createCherryBlossoms();

    // 创建页面背景Canvas效果
    createBackgroundEffect();

    // 预加载动画
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', function () {
            preloader.classList.add('fade-out');
            setTimeout(function () {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // 导航菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // 滚动时导航栏效果 - 使用节流优化性能
    const handleScroll = throttle(function () {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // 回到顶部按钮显示/隐藏
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (window.scrollY > 300) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }
    });

    // 回到顶部按钮点击事件
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 游戏分类过滤器
    const categoryFilters = document.querySelectorAll('.category-filter');
    const gameItems = document.querySelectorAll('.game-item');

    if (categoryFilters.length > 0 && gameItems.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function () {
                // 移除所有过滤器的active类
                categoryFilters.forEach(f => f.classList.remove('active'));
                // 添加当前过滤器的active类
                this.classList.add('active');

                const category = this.getAttribute('data-category');

                // 显示或隐藏游戏项目
                gameItems.forEach(item => {
                    if (category === 'all') {
                        item.style.display = 'block';
                        // 添加淡入动画
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 50);
                    } else if (item.getAttribute('data-category') === category) {
                        item.style.display = 'block';
                        // 添加淡入动画
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 排行榜标签切换
    const leaderboardTabs = document.querySelectorAll('.leaderboard-tab');
    const leaderboardContents = document.querySelectorAll('.leaderboard-content');

    if (leaderboardTabs.length > 0 && leaderboardContents.length > 0) {
        leaderboardTabs.forEach((tab, index) => {
            tab.addEventListener('click', function () {
                // 移除所有标签和内容的active类
                leaderboardTabs.forEach(t => t.classList.remove('active'));
                leaderboardContents.forEach(c => c.classList.remove('active'));

                // 添加当前标签和对应内容的active类
                this.classList.add('active');
                leaderboardContents[index].classList.add('active');
            });
        });
    }

    // 博客搜索功能
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const searchInput = this.querySelector('input').value.toLowerCase();

            // 在实际应用中，这里可以添加搜索逻辑或重定向到搜索结果页面
            alert('搜索功能: ' + searchInput);
        });
    }

    // 评论表单提交
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 在实际应用中，这里可以添加评论提交逻辑
            alert('评论已提交！');
            this.reset();
        });
    }

    // 联系表单提交
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 在实际应用中，这里可以添加联系表单提交逻辑
            alert('消息已发送！');
            this.reset();
        });
    }

    // 订阅表单提交
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 在实际应用中，这里可以添加订阅表单提交逻辑
            alert('订阅成功！');
            this.reset();
        });
    }

    // 图片懒加载
    const lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 添加视差滚动效果
    window.addEventListener('scroll', function () {
        const parallaxElements = document.querySelectorAll('.parallax');
        if (parallaxElements.length > 0) {
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(window.scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }
    });

    // 添加滚动动画效果
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (elements.length > 0) {
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (elementPosition < windowHeight - 50) {
                    element.classList.add('animated');
                }
            });
        }
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // 初始检查

    // 添加鼠标跟随效果
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);

    document.addEventListener('mousemove', function (e) {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    });

    // 链接和按钮悬停效果
    const interactiveElements = document.querySelectorAll('a, button, .btn');
    if (interactiveElements.length > 0) {
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function () {
                cursorFollower.classList.add('active');
            });

            element.addEventListener('mouseleave', function () {
                cursorFollower.classList.remove('active');
            });
        });
    }

    // 添加打字机效果
    const typingElements = document.querySelectorAll('.typing-effect');
    if (typingElements.length > 0) {
        typingElements.forEach(element => {
            const text = element.getAttribute('data-text');
            const speed = parseInt(element.getAttribute('data-speed')) || 100;

            if (text) {
                element.textContent = '';
                let i = 0;

                const typeWriter = function () {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(typeWriter, speed);
                    }
                };

                typeWriter();
            }
        });
    }

    // 添加滚动进度条
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function () {
        const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (windowScroll / height) * 100;

        progressBar.style.width = scrolled + '%';
    });

    // 添加图片放大查看效果
    const zoomableImages = document.querySelectorAll('.zoomable');
    if (zoomableImages.length > 0) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'image-modal';
        modal.innerHTML = `
            <span class="close-modal">&times;</span>
            <img class="modal-content">
        `;
        document.body.appendChild(modal);

        const modalImg = modal.querySelector('.modal-content');
        const closeModal = modal.querySelector('.close-modal');

        zoomableImages.forEach(img => {
            img.style.cursor = 'zoom-in';

            img.addEventListener('click', function () {
                modal.style.display = 'flex';
                modalImg.src = this.src;
            });
        });

        closeModal.addEventListener('click', function () {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // 添加平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 考虑固定导航栏的高度
                    behavior: 'smooth'
                });
            }
        });
    });

    // 添加计数器动画
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = parseInt(counter.getAttribute('data-duration')) || 2000;
                    let count = 0;
                    const increment = target / (duration / 16); // 假设60fps

                    const updateCounter = function () {
                        count += increment;
                        if (count < target) {
                            counter.textContent = Math.ceil(count);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // 添加粒子背景效果
    const particleContainers = document.querySelectorAll('.particles-bg');
    if (particleContainers.length > 0) {
        particleContainers.forEach(container => {
            const particleCount = parseInt(container.getAttribute('data-particles')) || 50;
            const particleColor = container.getAttribute('data-color') || '#ffffff';

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.backgroundColor = particleColor;
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
                particle.style.animationDelay = (Math.random() * 5) + 's';
                container.appendChild(particle);
            }
        });
    }
});

// 主题切换功能
function initThemeSwitcher() {
    // 获取保存的主题或默认为樱花主题
    const savedTheme = localStorage.getItem('theme') || 'cherry';
    const savedMode = localStorage.getItem('themeMode') || 'manual'; // manual 或 auto

    // 应用主题
    applyTheme(savedTheme, savedMode);

    // 创建主题切换器UI
    createThemeSwitcherUI();

    // 监听系统主题变化（如果是自动模式）
    if (window.matchMedia) {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addListener((e) => {
            const mode = localStorage.getItem('themeMode');
            if (mode === 'auto') {
                applyAutoTheme();
            }
        });
    }
}

function createThemeSwitcherUI() {
    // 创建主题切换器容器
    const themeSwitcher = document.createElement('div');
    themeSwitcher.className = 'theme-switcher';
    themeSwitcher.innerHTML = `
        <button class="theme-toggle-btn" aria-label="切换主题">
            <i class="fas fa-palette"></i>
        </button>
        <div class="theme-menu">
            <h4>选择主题</h4>
            <div class="theme-options">
                <div class="theme-option" data-theme="auto">
                    <i class="fas fa-magic"></i>
                    <span>跟随系统</span>
                </div>
                <div class="theme-option" data-theme="cherry">
                    <div class="theme-color-preview"></div>
                    <span>樱花粉</span>
                </div>
                <div class="theme-option" data-theme="dark">
                    <div class="theme-color-preview"></div>
                    <span>深色</span>
                </div>
                <div class="theme-option" data-theme="light">
                    <div class="theme-color-preview"></div>
                    <span>浅色</span>
                </div>
                <div class="theme-option" data-theme="blue">
                    <div class="theme-color-preview"></div>
                    <span>海洋蓝</span>
                </div>
                <div class="theme-option" data-theme="green">
                    <div class="theme-color-preview"></div>
                    <span>森林绿</span>
                </div>
                <div class="theme-option" data-theme="orange">
                    <div class="theme-color-preview"></div>
                    <span>活力橙</span>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(themeSwitcher);

    // 获取元素
    const toggleBtn = themeSwitcher.querySelector('.theme-toggle-btn');
    const themeMenu = themeSwitcher.querySelector('.theme-menu');
    const themeOptions = themeSwitcher.querySelectorAll('.theme-option');

    // 切换菜单显示
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themeMenu.classList.toggle('active');
    });

    // 点击外部关闭菜单
    document.addEventListener('click', (e) => {
        if (!themeSwitcher.contains(e.target)) {
            themeMenu.classList.remove('active');
        }
    });

    // 主题选项点击事件
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');

            if (theme === 'auto') {
                localStorage.setItem('themeMode', 'auto');
                applyAutoTheme();
            } else {
                localStorage.setItem('themeMode', 'manual');
                localStorage.setItem('theme', theme);
                applyTheme(theme, 'manual');
            }

            // 更新选中状态
            updateActiveTheme();

            // 关闭菜单
            themeMenu.classList.remove('active');
        });
    });

    // 初始化选中状态
    updateActiveTheme();
}

function applyTheme(theme, mode) {
    const root = document.documentElement;

    if (mode === 'auto') {
        // 自动模式：根据系统主题选择
        applyAutoTheme();
    } else {
        // 手动模式：应用选择的主题
        if (theme === 'cherry') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', theme);
        }
    }
}

function applyAutoTheme() {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (prefersDark) {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'cherry');
    }
}

function updateActiveTheme() {
    const themeOptions = document.querySelectorAll('.theme-option');
    const currentMode = localStorage.getItem('themeMode') || 'manual';
    const currentTheme = localStorage.getItem('theme') || 'cherry';

    themeOptions.forEach(option => {
        option.classList.remove('active');

        const theme = option.getAttribute('data-theme');

        if (currentMode === 'auto' && theme === 'auto') {
            option.classList.add('active');
        } else if (currentMode === 'manual' && theme === currentTheme) {
            option.classList.add('active');
        }
    });
}

// 鼠标跟随光标效果
function initCursorEffects() {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorOutline = document.createElement('div');
    cursorOutline.className = 'cursor-outline';
    document.body.appendChild(cursorOutline);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // 平滑跟随
    function animateOutline() {
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;

        cursorOutline.style.left = outlineX + 'px';
        cursorOutline.style.top = outlineY + 'px';

        requestAnimationFrame(animateOutline);
    }
    animateOutline();

    // 悬停效果
    const interactiveElements = document.querySelectorAll('a, button, .btn, .blog-card, .category-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('active');
            cursorDot.style.transform = 'scale(2)';
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('active');
            cursorDot.style.transform = 'scale(1)';
        });
    });
}

// 点击波纹效果
function initRippleEffect() {
    document.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        ripple.style.left = e.clientX + 'px';
        ripple.style.top = e.clientY + 'px';

        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// 滚动进度条
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 浮动粒子效果
function initParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    document.body.appendChild(particlesContainer);

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        particlesContainer.appendChild(particle);
    }
}

// 页面加载动画
function initPageLoader() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = '<div class="loader-spinner"></div>';
    document.body.appendChild(loader);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 500);
        }, 500);
    });
}

// 增强卡片悬停效果
document.querySelectorAll('.blog-card, .category-item').forEach(card => {
    card.addEventListener('mouseenter', function (e) {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function (e) {
        this.style.zIndex = '1';
    });

    // 3D倾斜效果
    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

// 文字打字机效果
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// 应用打字机效果到标题
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    setTimeout(() => {
        typeWriter(heroTitle, originalText, 80);
    }, 500);
}

// 数字计数动画
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.ceil(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    updateCounter();
}

// 应用到统计数字
document.querySelectorAll('.stat-info h3, .category-count').forEach(el => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(el.textContent);
                if (!isNaN(target)) {
                    animateCounter(el, target);
                }
                observer.unobserve(el);
            }
        });
    });

    observer.observe(el);
});

// 视差滚动效果
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // 英雄区域视差
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }

    // 其他元素视差
    document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = el.dataset.parallax || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// 元素进入视口动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.blog-card, .category-item, .value-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// 图片懒加载增强
document.querySelectorAll('img').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';

    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
});

// 平滑滚动增强
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // 忽略空的#或#top链接
        if (href === '#' || href === '#top' || !href || href.length <= 1) {
            return;
        }

        e.preventDefault();

        try {
            const target = document.querySelector(href);

            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // 添加高亮动画
                target.style.animation = 'pulse 0.6s ease-in-out';
                setTimeout(() => {
                    target.style.animation = '';
                }, 600);
            }
        } catch (error) {
            // 忽略无效的选择器错误
            console.warn('Invalid selector:', href);
        }
    });
});

// 表单输入动画
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
        this.parentElement.style.boxShadow = '0 5px 20px rgba(255, 94, 179, 0.3)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = '';
        this.parentElement.style.boxShadow = '';
    });
});

// 按钮点击动画增强
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = ripple.style.height = '100px';
        ripple.style.left = e.offsetX - 50 + 'px';
        ripple.style.top = e.offsetY - 50 + 'px';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';

        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

console.log('🎨 所有动画特效已加载！');
