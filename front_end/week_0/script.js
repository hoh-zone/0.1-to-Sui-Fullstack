  // 主题切换功能
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // 检查本地存储中的主题设置
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    themeToggle.textContent = '切换到亮色主题';
}

  themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDarkTheme = document.body.classList.contains('dark-theme');
      themeToggle.textContent = isDarkTheme ? '切换到亮色主题' : '切换到暗色主题';

      // 保存主题设置到本地存储
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
  });

  // 文章的点击事件处理
//   document.getElementById('home').addEventListener('click', function(e) {
//     if (e.target.tagName === 'BUTTON') {
//         const article = e.target.closest('article');
//         const content = article.querySelector('p');
//         if (content.style.display === 'none') {
//             content.style.display = 'block';
//             e.target.textContent = '收起';
//         } else {
//             content.style.display = 'none';
//             e.target.textContent = '阅读更多';
//         }
//     }
// });
document.getElementById('home').addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
        const article = e.target.closest('article');
        const content = article.querySelector('[id^="article-content"]');
        const isExpanded = e.target.getAttribute('aria-expanded') === 'true';
        
        content.hidden = isExpanded;
        e.target.setAttribute('aria-expanded', !isExpanded);
        e.target.textContent = isExpanded ? '阅读更多' : '收起';
    }
});


  // 导航功能
  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('main > section');

  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href').slice(1);
          sections.forEach(section => {
              section.style.display = section.id === targetId ? 'block' : 'none';
          });
      });
  });

  // 表单提交
 contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    try {
        // 模拟异步操作
        await new Promise(resolve => setTimeout(resolve, 2000));

        const formData = new FormData(contactForm);
        const formObject = Object.fromEntries(formData.entries());
        console.log('表单数据:', formObject);

        const successMessage = document.createElement('p');
        successMessage.textContent = '感谢您的留言！我会尽快回复。';
        successMessage.style.color = 'green';
        contactForm.appendChild(successMessage);

        setTimeout(() => {
            successMessage.remove();
            contactForm.reset();
        }, 3000);
    } catch (error) {
        console.error('提交失败:', error);
    } finally {
        loader.style.display = 'none';
    }
});


  // 搜索功能
const searchInput = document.getElementById('search');
const articlesSearch = document.querySelectorAll('article');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  articlesSearch.forEach(article => {
      const title = article.querySelector('h3').textContent.toLowerCase();
      const content = article.querySelector('p').textContent.toLowerCase();
      if (title.includes(searchTerm) || content.includes(searchTerm)) {
          article.style.display = 'block';
      } else {
          article.style.display = 'none';
      }
  });
});