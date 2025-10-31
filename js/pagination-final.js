// 最终版分页 - 使用visibility控制
window.addEventListener('load', function() {
    console.log('🔄 最终版分页脚本启动...');
    
    const POSTS_PER_PAGE = 5;
    let currentPage = 1;
    
    const blogMain = document.querySelector('.blog-main');
    const paginationDiv = document.getElementById('pagination');
    
    if (!blogMain || !paginationDiv) {
        console.log('❌ 未找到必要元素');
        return;
    }
    
    const allPosts = blogMain.querySelectorAll('.blog-item');
    console.log('✅ 找到', allPosts.length, '篇文章');
    
    if (allPosts.length === 0) return;
    
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    console.log('📄 总页数:', totalPages);
    
    // 给每篇文章添加data-index属性
    allPosts.forEach(function(post, index) {
        post.setAttribute('data-index', index);
    });
    
    function showPage(page) {
        console.log('📖 切换到第', page, '页');
        
        const start = (page - 1) * POSTS_PER_PAGE;
        const end = Math.min(start + POSTS_PER_PAGE, allPosts.length);
        
        // 使用visibility和height来控制显示
        allPosts.forEach(function(post, index) {
            if (index >= start && index < end) {
                // 显示 - 使用flex布局
                post.style.cssText = `
                    display: flex !important;
                    flex-direction: row !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                `;
                console.log('✓ 显示文章', index);
            } else {
                // 隐藏
                post.style.cssText = 'display: none !important;';
            }
        });
        
        renderPagination(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function renderPagination(page) {
        let html = '';
        
        if (page > 1) {
            html += '<a href="javascript:void(0)" class="prev" onclick="window.goToPage(' + (page - 1) + ')">◀</a>';
        }
        
        for (let i = 1; i <= totalPages; i++) {
            if (i === page) {
                html += '<a href="javascript:void(0)" class="active">' + i + '</a>';
            } else {
                html += '<a href="javascript:void(0)" onclick="window.goToPage(' + i + ')">' + i + '</a>';
            }
        }
        
        if (page < totalPages) {
            html += '<a href="javascript:void(0)" class="next" onclick="window.goToPage(' + (page + 1) + ')">▶</a>';
        }
        
        paginationDiv.innerHTML = html;
    }
    
    window.goToPage = function(page) {
        currentPage = page;
        showPage(page);
    };
    
    // 初始化
    showPage(1);
    console.log('✅ 分页初始化完成');
});
