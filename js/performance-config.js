/**
 * 性能配置 - 根据设备自动调整
 */

const PerformanceConfig = {
    // 检测设备性能
    isLowEnd: function() {
        // CPU核心数
        const cores = navigator.hardwareConcurrency || 2;
        
        // 移动设备检测
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        
        // 内存检测（如果支持）
        const memory = navigator.deviceMemory || 4;
        
        return cores <= 2 || isMobile || memory < 4;
    },
    
    // 获取优化配置
    getConfig: function() {
        const isLowEnd = this.isLowEnd();
        
        return {
            // 樱花飘落数量
            fallingPetalsCount: isLowEnd ? 15 : 30,
            
            // 动画帧率限制
            targetFPS: isLowEnd ? 30 : 60,
            
            // 粒子数量
            particleCount: isLowEnd ? 30 : 50,
            
            // 是否启用复杂动画
            enableComplexAnimations: !isLowEnd,
            
            // 是否启用背景Canvas
            enableBackgroundCanvas: !isLowEnd,
            
            // 樱花树摇摆效果
            enableTreeSway: !isLowEnd,
            
            // 图片懒加载阈值
            lazyLoadThreshold: isLowEnd ? 0.1 : 0.01,
            
            // 防抖延迟
            debounceDelay: isLowEnd ? 300 : 150,
            
            // 节流延迟
            throttleDelay: isLowEnd ? 200 : 100
        };
    },
    
    // 应用性能优化
    apply: function() {
        const config = this.getConfig();
        
        // 设置全局配置
        window.PERF_CONFIG = config;
        
        // 如果是低端设备，添加标记
        if (this.isLowEnd()) {
            document.documentElement.classList.add('low-end-device');
            console.log('🔧 检测到低端设备，已启用性能优化模式');
        }
        
        return config;
    }
};

// 立即应用配置
PerformanceConfig.apply();
