// 博客列表分页功能
(function() {
    'use strict';

    // 配置
    const POSTS_PER_PAGE = 5; // 每页显示5篇文章
    let currentPage = 1;

    // 初始化分页
    function initPagination() {
        const blogMain = document.querySelector('.blog-main');
        if (!blogMain) {
            console.log('未找到 .blog-main 元素');
            return;
        }

        const allPosts = Array.from(blogMain.querySelectorAll('.blog-item'));
        console.log(`找到 ${allPosts.length} 篇文章`);
        
        if (allPosts.length === 0) {
            console.log('没有找到文章');
            return;
        }
        
        const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
        console.log(`总共 ${totalPages} 页，每页 ${POSTS_PER_PAGE} 篇`);

        // 显示当前页的文章
        function showPage(page) {
            currentPage = page;
            
            // 隐藏所有文章
            allPosts.forEach(post => {
                post.style.setProperty('display', 'none', 'important');
            });

            // 显示当前页的文章
            const start = (page - 1) * POSTS_PER_PAGE;
            const end = start + POSTS_PER_PAGE;
            const postsToShow = allPosts.slice(start, end);
            
            postsToShow.forEach(post => {
                post.style.setProperty('display', 'grid', 'important');
            });

            // 更新分页按钮
            updatePagination(page, totalPages);

            // 滚动到顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // 更新分页按钮
        function updatePagination(page, total) {
            const pagination = document.getElementById('pagination');
            if (!pagination) return;

            let html = '';

            // 上一页按钮
            if (page > 1) {
                html += `<a href="#" class="prev" data-page="${page - 1}"><i class="fas fa-angle-left"></i></a>`;
            }

            // 页码按钮
            for (let i = 1; i <= total; i++) {
                if (i === page) {
                    html += `<a href="#" class="active" data-page="${i}">${i}</a>`;
                } else {
                    html += `<a href="#" data-page="${i}">${i}</a>`;
                }
            }

            // 下一页按钮
            if (page < total) {
                html += `<a href="#" class="next" data-page="${page + 1}"><i class="fas fa-angle-right"></i></a>`;
            }

            pagination.innerHTML = html;

            // 绑定点击事件
            pagination.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetPage = parseInt(this.getAttribute('data-page'));
                    if (targetPage && targetPage !== currentPage) {
                        showPage(targetPage);
                    }
                });
            });
        }

        // 初始显示第一页
        if (allPosts.length > 0) {
            showPage(1);
        }
    }

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // 延迟执行，确保AOS初始化完成
            setTimeout(initPagination, 100);
        });
    } else {
        // 延迟执行，确保AOS初始化完成
        setTimeout(initPagination, 100);
    }

})();
