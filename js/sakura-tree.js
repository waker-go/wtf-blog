/**
 * 真实樱花树 - 模仿实景照片
 * 粗壮主干 + 大主枝 + 花团簇拥
 */

class SakuraTree {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        
        // 创建离屏Canvas用于缓存静态树
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        
        // 固定随机种子，保证树的形状一致
        this.seed = 12345;
        this.randomSeed = this.seed;
        
        // 当前主题
        this.currentTheme = this.getCurrentTheme();
        
        // 预渲染花朵图案（4种颜色）
        this.flowerPatterns = this.createFlowerPatterns();
        
        this.resize();
        
        this.fallingPetals = [];
        this.branches = [];
        this.flowerClusters = []; // 花团
        
        // 微风效果
        this.windTime = 0;
        this.windStrength = 0;
        
        window.addEventListener('resize', () => {
            this.resize();
            this.randomSeed = this.seed; // 重置随机种子
            this.generateTree();
            this.renderTreeToCache();
        });
        
        // 监听主题变化
        this.observeThemeChange();
        
        this.generateTree();
        this.renderTreeToCache();
        this.initFallingPetals();
        this.animate();
    }
    
    // 获取当前主题
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'cherry';
    }
    
    // 根据主题获取颜色配置
    getThemeColors(theme) {
        // 所有主题都使用经典的樱花粉色，保持一致性和美观
        const classicPink = [
            { r: 255, g: 200, b: 220 },
            { r: 255, g: 210, b: 230 },
            { r: 255, g: 220, b: 235 },
            { r: 255, g: 195, b: 215 }
        ];
        
        return classicPink;
    }
    
    // 监听主题变化
    observeThemeChange() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = this.getCurrentTheme();
                    if (newTheme !== this.currentTheme) {
                        this.currentTheme = newTheme;
                        this.updateTheme();
                    }
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    // 更新主题
    updateTheme() {
        // 重新生成花朵图案
        this.flowerPatterns = this.createFlowerPatterns();
        // 重新渲染树
        this.randomSeed = this.seed;
        this.generateTree();
        this.renderTreeToCache();
        // 更新飘落花瓣颜色
        this.updateFallingPetalsColor();
    }
    
    // 更新飘落花瓣颜色
    updateFallingPetalsColor() {
        // 飘落花瓣会在下次绘制时自动使用新颜色
    }
    
    // 预渲染花朵图案（三种层次：前景清晰、中景柔和、后景模糊）
    createFlowerPatterns() {
        const patterns = {
            foreground: [], // 前景：清晰锐利
            middle: [],     // 中景：稍微柔和
            background: []  // 后景：模糊
        };
        
        // 根据当前主题获取颜色
        const colors = this.getThemeColors(this.currentTheme);
        
        colors.forEach(color => {
            const size = 30;
            
            // 前景花朵：清晰锐利
            const fgCanvas = document.createElement('canvas');
            fgCanvas.width = size * 2;
            fgCanvas.height = size * 2;
            const fgCtx = fgCanvas.getContext('2d');
            fgCtx.translate(size, size);
            
            for (let p = 0; p < 5; p++) {
                fgCtx.save();
                fgCtx.rotate((p * Math.PI * 2) / 5);
                
                // 前景：边缘清晰，只在最外层稍微透明
                const fgGradient = fgCtx.createRadialGradient(0, -size * 0.4, 0, 0, -size * 0.4, size * 0.5);
                fgGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 1)`);
                fgGradient.addColorStop(0.85, `rgba(${color.r}, ${color.g}, ${color.b}, 0.95)`);
                fgGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`);
                
                fgCtx.fillStyle = fgGradient;
                fgCtx.beginPath();
                fgCtx.ellipse(0, -size * 0.4, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
                fgCtx.fill();
                fgCtx.restore();
            }
            
            fgCtx.fillStyle = 'rgba(255, 230, 180, 1)';
            fgCtx.beginPath();
            fgCtx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
            fgCtx.fill();
            patterns.foreground.push(fgCanvas);
            
            // 中景花朵：稍微柔和
            const mdCanvas = document.createElement('canvas');
            mdCanvas.width = size * 2;
            mdCanvas.height = size * 2;
            const mdCtx = mdCanvas.getContext('2d');
            mdCtx.translate(size, size);
            
            for (let p = 0; p < 5; p++) {
                mdCtx.save();
                mdCtx.rotate((p * Math.PI * 2) / 5);
                
                const mdGradient = mdCtx.createRadialGradient(0, -size * 0.4, 0, 0, -size * 0.4, size * 0.55);
                mdGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.9)`);
                mdGradient.addColorStop(0.7, `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`);
                mdGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`);
                
                mdCtx.fillStyle = mdGradient;
                mdCtx.beginPath();
                mdCtx.ellipse(0, -size * 0.4, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
                mdCtx.fill();
                mdCtx.restore();
            }
            
            mdCtx.fillStyle = 'rgba(255, 230, 180, 0.8)';
            mdCtx.beginPath();
            mdCtx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
            mdCtx.fill();
            patterns.middle.push(mdCanvas);
            
            // 后景花朵：模糊柔和
            const bgCanvas = document.createElement('canvas');
            bgCanvas.width = size * 2;
            bgCanvas.height = size * 2;
            const bgCtx = bgCanvas.getContext('2d');
            bgCtx.translate(size, size);
            
            for (let p = 0; p < 5; p++) {
                bgCtx.save();
                bgCtx.rotate((p * Math.PI * 2) / 5);
                
                const bgGradient = bgCtx.createRadialGradient(0, -size * 0.4, 0, 0, -size * 0.4, size * 0.6);
                bgGradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`);
                bgGradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`);
                bgGradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);
                
                bgCtx.fillStyle = bgGradient;
                bgCtx.beginPath();
                bgCtx.ellipse(0, -size * 0.4, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
                bgCtx.fill();
                bgCtx.restore();
            }
            
            bgCtx.fillStyle = 'rgba(255, 230, 180, 0.5)';
            bgCtx.beginPath();
            bgCtx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
            bgCtx.fill();
            patterns.background.push(bgCanvas);
        });
        
        return patterns;
    }
    
    // 伪随机数生成器（固定种子）
    seededRandom() {
        this.randomSeed = (this.randomSeed * 9301 + 49297) % 233280;
        return this.randomSeed / 233280;
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;
        
        // 使用固定基准尺寸生成树，然后缩放
        this.baseWidth = 800;
        this.baseHeight = 600;
        this.scaleX = this.canvas.width / this.baseWidth;
        this.scaleY = this.canvas.height / this.baseHeight;
        
        this.centerX = this.baseWidth / 2;
        this.baseY = this.baseHeight * 1.0;
    }

    // 生成树形结构
    generateTree() {
        this.branches = [];
        this.flowerClusters = [];
        
        const startX = this.centerX;
        const startY = this.baseY;
        
        // 使用固定基准尺寸生成树
        const trunkHeight = this.baseHeight * 0.35;
        this.drawTrunk(startX, startY, startX - 8, startY - trunkHeight, 70, 45);
        
        const trunkTopX = startX - 8;
        const trunkTopY = startY - trunkHeight;
        
        // 主干顶部向上的中心枝
        this.growBranch(trunkTopX, trunkTopY, -Math.PI / 2, this.baseHeight * 0.15, 32, 1);
        
        // 3-4个大主枝
        const numMainBranches = 3 + Math.floor(this.seededRandom() * 2);
        
        for (let i = 0; i < numMainBranches; i++) {
            const heightRatio = 0.3 + i * 0.15 + this.seededRandom() * 0.1;
            const branchY = startY - trunkHeight * heightRatio;
            const branchX = startX - 8 * heightRatio;
            
            const side = i % 2 === 0 ? -1 : 1;
            const angle = -Math.PI / 2 + side * (0.4 + this.seededRandom() * 0.3);
            const length = this.baseHeight * (0.26 + this.seededRandom() * 0.1);
            
            this.growBranch(branchX, branchY, angle, length, 35, 1);
        }
        
        // 中上部小分支
        for (let i = 0; i < 2; i++) {
            const heightRatio = 0.6 + i * 0.15;
            const branchY = startY - trunkHeight * heightRatio;
            const branchX = startX - 8 * heightRatio;
            
            const side = i % 2 === 0 ? 1 : -1;
            const angle = -Math.PI / 2 + side * (0.25 + this.seededRandom() * 0.2);
            const length = this.baseHeight * 0.18;
            
            this.growBranch(branchX, branchY, angle, length, 28, 1);
        }
    }

    // 绘制主干（渐变粗细）
    drawTrunk(x1, y1, x2, y2, width1, width2) {
        const steps = 12;
        for (let i = 0; i < steps; i++) {
            const t1 = i / steps;
            const t2 = (i + 1) / steps;
            
            const sx = x1 + (x2 - x1) * t1;
            const sy = y1 + (y2 - y1) * t1;
            const ex = x1 + (x2 - x1) * t2;
            const ey = y1 + (y2 - y1) * t2;
            const w = width1 + (width2 - width1) * t1;
            
            this.branches.push({
                x1: sx, y1: sy,
                x2: ex, y2: ey,
                width: w,
                depth: 0
            });
        }
    }

    // 递归生成树枝
    growBranch(x, y, angle, length, width, depth) {
        if (depth > 9 || length < 6) return;

        const endX = x + Math.cos(angle) * length;
        const endY = y + Math.sin(angle) * length;

        this.branches.push({
            x1: x, y1: y,
            x2: endX, y2: endY,
            width: width,
            depth: depth
        });

        // 沿着所有枝条分布花朵（不只是末端）
        if (depth >= 4) {
            // 85%的枝条有花（增加密度）
            if (this.seededRandom() < 0.85) {
                // 根据枝条长度决定花朵数量（增加花朵数量）
                const numFlowers = depth >= 7 ? 4 : (depth >= 6 ? 3 : 2);
                
                for (let f = 0; f < numFlowers; f++) {
                    // 沿着枝条均匀分布
                    const t = (f + 0.5) / numFlowers + (this.seededRandom() - 0.5) * 0.2;
                    const fx = x + (endX - x) * t;
                    const fy = y + (endY - y) * t;
                    
                    // 轻微偏离树枝
                    const offsetRatio = 0.08 + this.seededRandom() * 0.12;
                    const offsetAngle = angle + Math.PI / 2 + (this.seededRandom() - 0.5) * Math.PI * 0.6;
                    const offsetDist = length * offsetRatio;
                    
                    // 分层
                    const layerDepth = this.seededRandom();
                    const isBackground = layerDepth < 0.3;
                    const isForeground = layerDepth > 0.7;
                    
                    this.flowerClusters.push({
                        x: fx + Math.cos(offsetAngle) * offsetDist,
                        y: fy + Math.sin(offsetAngle) * offsetDist,
                        // 小花朵
                        size: isForeground ? 10 + this.seededRandom() * 6 : (isBackground ? 6 + this.seededRandom() * 4 : 8 + this.seededRandom() * 4),
                        isSingle: true,
                        rotation: this.seededRandom() * Math.PI * 2,
                        patternIndex: Math.floor(this.seededRandom() * 4),
                        opacity: isForeground ? 0.9 : (isBackground ? 0.4 + this.seededRandom() * 0.2 : 0.65 + this.seededRandom() * 0.2),
                        density: 0,
                        layer: isForeground ? 2 : (isBackground ? 0 : 1)
                    });
                }
            }
        }

        // 分叉 - 减少分支数量，让树更稀疏
        if (depth < 8) { // 减少深度
            let numBranches;
            if (depth < 2) {
                numBranches = 2; // 主枝只2叉
            } else if (depth < 5) {
                numBranches = this.seededRandom() > 0.5 ? 2 : 3;
            } else {
                numBranches = 2; // 细枝只2叉
            }
            
            for (let i = 0; i < numBranches; i++) {
                let angleOffset;
                if (numBranches === 2) {
                    angleOffset = (i === 0 ? -1 : 1) * (0.4 + this.seededRandom() * 0.3);
                } else {
                    angleOffset = (i - 1) * (0.45 + this.seededRandom() * 0.2);
                }
                
                const newAngle = angle + angleOffset;
                const newLength = length * (0.65 + this.seededRandom() * 0.15);
                const newWidth = width * 0.7;
                
                this.growBranch(endX, endY, newAngle, newLength, newWidth, depth + 1);
            }
        }
    }

    initFallingPetals() {
        // 根据性能配置调整花瓣数量
        const petalCount = window.PERF_CONFIG ? window.PERF_CONFIG.fallingPetalsCount : 30;
        
        for (let i = 0; i < petalCount; i++) {
            this.fallingPetals.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                size: 4 + Math.random() * 5,
                speed: 0.3 + Math.random() * 0.5,
                swing: Math.random() * Math.PI * 2,
                swingSpeed: 0.01 + Math.random() * 0.015,
                swingAmplitude: 1 + Math.random() * 2, // 摆动幅度
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.06,
                opacity: 0.5 + Math.random() * 0.5,
                // 花瓣形状（5瓣）
                petalShape: Math.random() > 0.5,
                // 垂直漂移
                verticalDrift: (Math.random() - 0.5) * 0.2
            });
        }
    }

    // 把树渲染到离屏Canvas（只执行一次）
    renderTreeToCache() {
        const ctx = this.offscreenCtx;
        
        // 清空离屏Canvas
        ctx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        
        // 应用缩放
        ctx.save();
        ctx.scale(this.scaleX, this.scaleY);
        
        // 先画所有树枝
        this.branches.forEach(branch => {
            const brownShade = 35 + branch.depth * 6;
            ctx.strokeStyle = `rgb(${brownShade}, ${brownShade - 8}, ${brownShade - 15})`;
            ctx.lineWidth = branch.width;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            
            ctx.beginPath();
            ctx.moveTo(branch.x1, branch.y1);
            ctx.lineTo(branch.x2, branch.y2);
            ctx.stroke();
        });
        
        // 按层次排序后绘制花朵（后景→中景→前景）
        const sortedClusters = [...this.flowerClusters].sort((a, b) => (a.layer || 1) - (b.layer || 1));
        
        sortedClusters.forEach(cluster => {
            this.drawFlowerCluster(ctx, cluster.x, cluster.y, cluster.size, cluster.density,
                                  cluster.isSingle, cluster.rotation, cluster.patternIndex, cluster.opacity, cluster.layer);
        });
        
        ctx.restore();
    }

    // 绘制单朵花或花团
    drawFlowerCluster(ctx, x, y, size, density, isSingle, rotation, patternIndex, opacity, layer) {
        if (isSingle) {
            // 根据层次选择对应的图案
            let patternArray;
            if (layer === 2) {
                patternArray = this.flowerPatterns.foreground; // 前景：清晰
            } else if (layer === 1) {
                patternArray = this.flowerPatterns.middle; // 中景：柔和
            } else {
                patternArray = this.flowerPatterns.background; // 后景：模糊
            }
            
            const pattern = patternArray[patternIndex];
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(rotation);
            ctx.globalAlpha = opacity;
            
            const scale = size / 15;
            ctx.drawImage(pattern, -pattern.width * scale / 2, -pattern.height * scale / 2, 
                         pattern.width * scale, pattern.height * scale);
            
            ctx.restore();
        } else {
            // 绘制花团（保留旧逻辑，以防需要）
            const numFlowers = Math.floor(size * density * 0.8);
            
            let tempSeed = Math.floor(x * 1000 + y * 1000);
            const tempRandom = () => {
                tempSeed = (tempSeed * 9301 + 49297) % 233280;
                return tempSeed / 233280;
            };
            
            for (let i = 0; i < numFlowers; i++) {
                const angle = tempRandom() * Math.PI * 2;
                const dist = tempRandom() * size * 0.6;
                const fx = x + Math.cos(angle) * dist;
                const fy = y + Math.sin(angle) * dist;
                const flowerSize = 7 + tempRandom() * 6;
                const rot = tempRandom() * Math.PI * 2;
                
                const pIndex = Math.floor(tempRandom() * this.flowerPatterns.length);
                const pattern = this.flowerPatterns[pIndex];
                
                ctx.save();
                ctx.translate(fx, fy);
                ctx.rotate(rot);
                ctx.globalAlpha = 0.8 + tempRandom() * 0.2;
                
                const scale = flowerSize / 15;
                ctx.drawImage(pattern, -pattern.width * scale / 2, -pattern.height * scale / 2, 
                             pattern.width * scale, pattern.height * scale);
                
                ctx.restore();
            }
        }
    }

    // 绘制飘落的花瓣
    drawFallingPetals() {
        const ctx = this.ctx;
        
        // 根据主题获取花瓣颜色
        const colors = this.getThemeColors(this.currentTheme);

        this.fallingPetals.forEach(petal => {
            // 受风影响的移动
            petal.y += petal.speed + petal.verticalDrift;
            petal.x += Math.sin(petal.swing) * petal.swingAmplitude + this.windStrength * 0.5;
            petal.swing += petal.swingSpeed;
            petal.rotation += petal.rotationSpeed;

            // 重置位置
            if (petal.y > this.canvas.height + 50) {
                petal.y = -50;
                petal.x = Math.random() * this.canvas.width;
            }
            if (petal.x < -50) petal.x = this.canvas.width + 50;
            if (petal.x > this.canvas.width + 50) petal.x = -50;

            ctx.save();
            ctx.translate(petal.x, petal.y);
            ctx.rotate(petal.rotation);
            ctx.globalAlpha = petal.opacity;

            // 随机选择颜色
            const colorIndex = Math.abs(Math.floor((petal.x + petal.y))) % colors.length;
            const petalColor = colors[colorIndex] || colors[0];

            if (petal.petalShape) {
                // 绘制5瓣花瓣形状
                for (let i = 0; i < 5; i++) {
                    ctx.save();
                    ctx.rotate((i * Math.PI * 2) / 5);
                    
                    const gradient = ctx.createRadialGradient(0, -petal.size * 0.4, 0, 0, -petal.size * 0.4, petal.size * 0.6);
                    gradient.addColorStop(0, `rgba(${petalColor.r}, ${petalColor.g}, ${petalColor.b}, 1)`);
                    gradient.addColorStop(0.7, `rgba(${petalColor.r}, ${petalColor.g}, ${petalColor.b}, 0.8)`);
                    gradient.addColorStop(1, `rgba(${petalColor.r}, ${petalColor.g}, ${petalColor.b}, 0.3)`);
                    
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.ellipse(0, -petal.size * 0.4, petal.size * 0.35, petal.size * 0.5, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                
                // 花心
                ctx.fillStyle = `rgba(255, 230, 180, 0.9)`;
                ctx.beginPath();
                ctx.arc(0, 0, petal.size * 0.25, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // 简单的椭圆花瓣
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, petal.size);
                gradient.addColorStop(0, `rgba(${petalColor.r}, ${petalColor.g}, ${petalColor.b}, 1)`);
                gradient.addColorStop(0.7, `rgba(${petalColor.r}, ${petalColor.g}, ${petalColor.b}, 0.8)`);
                gradient.addColorStop(1, `rgba(${petalColor.r}, ${petalColor.g}, ${petalColor.b}, 0.2)`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, petal.size, petal.size * 0.7, 0, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });
    }

    animate() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新微风效果
        this.windTime += 0.01;
        this.windStrength = Math.sin(this.windTime) * 0.8 + Math.sin(this.windTime * 2.3) * 0.4;
        
        // 检查是否启用树摇摆效果
        const enableSway = !window.PERF_CONFIG || window.PERF_CONFIG.enableTreeSway;
        
        if (enableSway) {
            // 应用微风摇曳效果到树
            this.ctx.save();
            
            // 轻微的整体摇摆
            const sway = Math.sin(this.windTime * 0.5) * 0.003;
            this.ctx.translate(this.canvas.width / 2, this.canvas.height);
            this.ctx.rotate(sway);
            this.ctx.translate(-this.canvas.width / 2, -this.canvas.height);
            
            // 绘制树（带微风效果）
            this.ctx.drawImage(this.offscreenCanvas, 0, 0);
            
            this.ctx.restore();
        } else {
            // 直接绘制树（无摇摆效果）
            this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        }
        
        // 绘制飘落的花瓣
        this.drawFallingPetals();

        requestAnimationFrame(() => this.animate());
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new SakuraTree('cherry-blossom-canvas');
});
