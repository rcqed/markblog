const postsPerPage = 5; // 每页显示的文章数
let currentPage = 1; // 当前页

function displayPosts(posts, page) {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const pagePosts = posts.slice(startIndex, endIndex);

    const blogPosts = document.getElementById('blog-posts');
    blogPosts.innerHTML = ''; // 清空内容

    pagePosts.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.id = `post`;
        postDiv.innerHTML = `<h2 id="title">${post.title}</h2><p id="time">${new Date(post.time).toLocaleString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</p>`;
        const link = document.createElement('a');
        link.href = `./doc.html?path=${post.filePath}`;
        link.appendChild(postDiv);
        blogPosts.appendChild(link);
    });
}

fetch('doclist.txt')
    .then(response => response.text())
    .then(data => {
        const lines = data.split('\n');
        const posts = lines
            .map(line => {
                if (line.trim() !== '') {
                    const parts = line.split(',');
                    return {
                        time: new Date(parts[0]).getTime(),
                        title: parts[1],
                        filePath: parts[2]
                    };
                }
                return null;
            })
            .filter(post => post !== null);

        posts.sort((a, b) => b.time - a.time);

        function updatePage() {
            displayPosts(posts, currentPage);
        }

		// 创建上一页和下一页按钮的容器
		const paginationContainer = document.createElement('div');
		paginationContainer.className = 'pagination-container';


        // 添加上一页按钮
        const prevButton = document.createElement('button');
        prevButton.innerText = 'Prev';
        prevButton.id = 'pagination-button';
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                window.location.hash = `#${currentPage}`; // 更新URL
                updatePage();
            }
        });

        // 添加下一页按钮
        const nextButton = document.createElement('button');
        nextButton.innerText = 'Next';
        nextButton.id = 'pagination-button';
        nextButton.addEventListener('click', () => {
            if (currentPage < Math.ceil(posts.length / postsPerPage)) {
                currentPage++;
                window.location.hash = `#${currentPage}`; // 更新URL
                updatePage();
            }
        });

		// 将按钮添加到容器
		paginationContainer.appendChild(prevButton);
		paginationContainer.appendChild(nextButton);

        // 添加页码导航
        const pageNav = document.createElement('div');
        pageNav.id = 'pagination-buttons';
        for (let i = 1; i <= Math.ceil(posts.length / postsPerPage); i++) {
            const pageLink = document.createElement('a');
            pageLink.id = 'pagination-num';
            pageLink.innerText = i;
            pageLink.href = `#${i}`; // 更新链接
            pageLink.addEventListener('click', (event) => {
                event.preventDefault();
                const page = parseInt(event.target.innerText);
                window.location.hash = `#${page}`; // 更新URL
                currentPage = page;
                updatePage();
            });
            pageNav.appendChild(pageLink);
        }

        // 检查URL中的锚点，以确定当前页
        const initialHash = window.location.hash;
        if (initialHash && initialHash.match(/^#\d+$/)) {
            const page = parseInt(initialHash.substring(1));
            if (page >= 1 && page <= Math.ceil(posts.length / postsPerPage)) {
                currentPage = page;
            }
        }

		// 将容器添加到页面中
		document.body.appendChild(paginationContainer);
        document.body.appendChild(pageNav);

        updatePage();
    })
    .catch(error => {
        console.error('Error reading doclist.txt:', error);
    });
