// 简单的博客分页功能
window.addEventListener('load', function() {
    console.log('分页脚本开始执行...');
    
    const POSTS_PER_PAGE = 5;
    let currentPage = 1;
    
    const blogMain = document.querySelector('.blog-main');
    const paginationDiv = document.getElementById('pagination');
    
    if (!blogMain || !paginationDiv) {
        console.log('未找到必要元素');
        return;
    }
    
    const allPosts = blogMain.querySelectorAll('.blog-item');
    console.log('找到文章数量:', allPosts.length);
    
    if (allPosts.length === 0) return;
    
    const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
    console.log('总页数:', totalPages);
    
    function showPage(page) {
        console.log('显示第', page, '页');
        
        // 隐藏所有文章 - 使用style直接设置
        allPosts.forEach(function(post, index) {
            post.style.setProperty('display', 'none', 'important');
        });
        
        // 显示当前页文章
        const start = (page - 1) * POSTS_PER_PAGE;
        const end = Math.min(start + POSTS_PER_PAGE, allPosts.length);
        
        console.log('显示文章索引:', start, '到', end - 1);
        
        for (let i = start; i < end; i++) {
            allPosts[i].style.setProperty('display', 'grid', 'important');
            console.log('文章', i, '设置display为grid，实际style.display:', allPosts[i].style.display);
            console.log('文章', i, '的完整style属性:', allPosts[i].getAttribute('style'));
        }
        
        // 更新分页按钮
        renderPagination(page);
        
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    function renderPagination(page) {
        console.log('渲染分页按钮，当前页:', page);
        
        let html = '';
        
        // 上一页
        if (page > 1) {
            html += '<a href="javascript:void(0)" class="prev" onclick="goToPage(' + (page - 1) + ')"><i class="fas fa-angle-left"></i></a>';
        }
        
        // 页码
        for (let i = 1; i <= totalPages; i++) {
            if (i === page) {
                html += '<a href="javascript:void(0)" class="active">' + i + '</a>';
            } else {
                html += '<a href="javascript:void(0)" onclick="goToPage(' + i + ')">' + i + '</a>';
            }
        }
        
        // 下一页
        if (page < totalPages) {
            html += '<a href="javascript:void(0)" class="next" onclick="goToPage(' + (page + 1) + ')"><i class="fas fa-angle-right"></i></a>';
        }
        
        console.log('分页HTML:', html);
        paginationDiv.innerHTML = html;
        console.log('分页容器内容已更新');
    }
    
    // 全局函数供onclick调用
    window.goToPage = function(page) {
        currentPage = page;
        showPage(page);
    };
    
    // 初始显示第一页
    showPage(1);
});
