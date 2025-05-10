export const generateWebsiteHtml = (info, type) => {
  const { 
    title, 
    description, 
    sections, 
    theme, 
    primaryColor, 
    secondaryColor = '#2ecc71',
    fontFamily = 'Segoe UI, sans-serif',
    features = {}
  } = info;
  
  const isDark = theme === 'dark';
  const websiteTitle = title || `我的${type || ''}网站`;
  const websiteDescription = description || '这是一个由AI生成的网站';
  
  // 基础CSS
  const baseStyles = `
    :root {
      --primary-color: ${primaryColor};
      --secondary-color: ${secondaryColor};
      --text-color: ${isDark ? '#ffffff' : '#333333'};
      --bg-color: ${isDark ? '#121212' : '#ffffff'};
      --section-bg: ${isDark ? '#1e1e1e' : '#f5f5f5'};
      --header-bg: ${isDark ? '#0a0a0a' : '#ffffff'};
      --footer-bg: ${isDark ? '#0a0a0a' : '#f0f0f0'};
      --border-color: ${isDark ? '#333333' : '#dddddd'};
      --card-bg: ${isDark ? '#1a1a1a' : '#ffffff'};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ${fontFamily};
      line-height: 1.6;
      color: var(--text-color);
      background-color: var(--bg-color);
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    header {
      background-color: var(--header-bg);
      padding: 20px 0;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--primary-color);
    }
    
    nav ul {
      display: flex;
      list-style: none;
    }
    
    nav ul li {
      margin-left: 20px;
    }
    
    nav ul li a {
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.3s;
    }
    
    nav ul li a:hover {
      color: var(--primary-color);
    }
    
    .hero {
      padding: 80px 0;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
      color: var(--primary-color);
    }
    
    .hero p {
      font-size: 1.2rem;
      max-width: 800px;
      margin: 0 auto 30px;
      opacity: 0.9;
    }
    
    .btn {
      display: inline-block;
      background-color: var(--primary-color);
      color: white;
      padding: 12px 24px;
      border-radius: 5px;
      text-decoration: none;
      font-weight: bold;
      transition: opacity 0.3s;
    }
    
    .btn:hover {
      opacity: 0.9;
    }
    
    section {
      padding: 60px 0;
    }
    
    section:nth-child(even) {
      background-color: var(--section-bg);
    }
    
    .section-title {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .section-title h2 {
      font-size: 2rem;
      color: var(--primary-color);
      margin-bottom: 10px;
    }
    
    .section-title p {
      opacity: 0.8;
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    
    .feature-item {
      background-color: var(--bg-color);
      border-radius: 5px;
      padding: 30px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.1);
      transition: transform 0.3s;
    }
    
    .feature-item:hover {
      transform: translateY(-5px);
    }
    
    .feature-item h3 {
      color: var(--primary-color);
      margin-bottom: 15px;
    }
    
    footer {
      background-color: var(--footer-bg);
      padding: 40px 0;
      text-align: center;
    }
    
    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .social-links {
      display: flex;
      margin-bottom: 20px;
    }
    
    .social-links a {
      display: inline-block;
      margin: 0 10px;
      color: var(--text-color);
      transition: color 0.3s;
    }
    
    .social-links a:hover {
      color: var(--primary-color);
    }
    
    .copyright {
      opacity: 0.7;
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
      }
      
      nav ul {
        margin-top: 20px;
        flex-direction: column;
        display: none;
      }
      
      nav ul.active {
        display: flex;
      }
      
      nav ul li {
        margin: 10px 0;
      }
      
      .menu-toggle {
        display: block;
      }
      
      .hero {
        padding: 60px 0;
      }
      
      .hero h1 {
        font-size: 2rem;
      }
      
      .features {
        grid-template-columns: 1fr;
      }
    }
    
    @media (max-width: 480px) {
      .hero h1 {
        font-size: 1.8rem;
      }
      
      .section-title h2 {
        font-size: 1.5rem;
      }
      
      .btn {
        padding: 10px 20px;
      }
    }
  `;

  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${websiteTitle}</title>
    <meta name="description" content="${websiteDescription}">
    <style>
      ${baseStyles}
      /* 响应式设计 */
      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          text-align: center;
        }
        
        nav ul {
          margin-top: 15px;
          justify-content: center;
        }
        
        nav ul li {
          margin: 0 10px;
        }
        
        .features {
          grid-template-columns: 1fr;
        }
      }
    </style>
</head>
<body>
    <header>
        <div class="container header-content">
            <div class="logo">${websiteTitle}</div>
            <nav>
                <ul>
                    <li><a href="#home">首页</a></li>
                    <li><a href="#about">关于</a></li>
                    <li><a href="#services">服务</a></li>
                    <li><a href="#contact">联系</a></li>
                </ul>
            </nav>
        </div>
    </header>
    
    <section id="home" class="hero">
        <div class="container">
            <h1>${websiteTitle}</h1>
            <p>${websiteDescription}</p>
            <a href="#contact" class="btn">联系我们</a>
        </div>
    </section>
    
    <!-- 动态生成网站内容部分 -->
    ${generateSections(sections, features)}
    
    <footer>
        <div class="container footer-content">
            <div class="social-links">
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
            </div>
            <p class="copyright">&copy; ${new Date().getFullYear()} ${websiteTitle}. 保留所有权利。</p>
        </div>
    </footer>
    
    <script>
        // 基本交互脚本
        document.addEventListener('DOMContentLoaded', function() {
            // 平滑滚动
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
            
            // 响应式导航
            const navToggle = document.createElement('button');
            navToggle.className = 'nav-toggle';
            navToggle.innerHTML = '&#9776;';
            navToggle.style.display = 'none';
            
            const nav = document.querySelector('nav');
            const headerContent = document.querySelector('.header-content');
            
            headerContent.insertBefore(navToggle, nav);
            
            navToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
            });
            
            // 响应式导航样式
            const style = document.createElement('style');
            style.textContent = \`
                @media (max-width: 768px) {
                    .nav-toggle {
                        display: block !important;
                        background: none;
                        border: none;
                        font-size: 1.5rem;
                        color: var(--text-color);
                        cursor: pointer;
                    }
                    
                    nav {
                        display: none;
                        width: 100%;
                    }
                    
                    nav.active {
                        display: block;
                    }
                    
                    nav ul {
                        flex-direction: column;
                    }
                    
                    nav ul li {
                        margin: 10px 0;
                    }
                }
            \`;
            
            document.head.appendChild(style);
        });
    </script>
</body>
</html>`;
};

// 辅助函数：生成网站内容部分
function generateSections(sections = [], features = {}) {
  if (!sections || sections.length === 0) {
    // 默认部分
    return `
    <section id="about">
        <div class="container">
            <div class="section-title">
                <h2>关于我们</h2>
                <p>了解更多关于我们的信息</p>
            </div>
            <div class="content">
                <p>这是一个由AI生成的网站示例。您可以在这里添加关于您的公司、产品或服务的详细信息。</p>
                <p>这个部分通常包含公司历史、使命和价值观等内容。</p>
            </div>
        </div>
    </section>
    
    <section id="services">
        <div class="container">
            <div class="section-title">
                <h2>我们的服务</h2>
                <p>我们提供的专业服务</p>
            </div>
            <div class="features">
                <div class="feature-item">
                    <h3>服务一</h3>
                    <p>这里是关于服务一的详细描述，解释其特点和优势。</p>
                </div>
                <div class="feature-item">
                    <h3>服务二</h3>
                    <p>这里是关于服务二的详细描述，解释其特点和优势。</p>
                </div>
                <div class="feature-item">
                    <h3>服务三</h3>
                    <p>这里是关于服务三的详细描述，解释其特点和优势。</p>
                </div>
            </div>
        </div>
    </section>
    
    <section id="contact">
        <div class="container">
            <div class="section-title">
                <h2>联系我们</h2>
                <p>有任何问题，请随时联系我们</p>
            </div>
            <div class="contact-form">
                <form>
                    <div class="form-group">
                        <input type="text" placeholder="您的姓名" required>
                    </div>
                    <div class="form-group">
                        <input type="email" placeholder="您的邮箱" required>
                    </div>
                    <div class="form-group">
                        <textarea placeholder="您的消息" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn">发送消息</button>
                </form>
            </div>
        </div>
    </section>`;
  }
  
  // 根据用户提供的部分生成内容
  return sections.map(section => {
    return `
    <section id="${section.id || section.title.toLowerCase().replace(/\s+/g, '-')}">
        <div class="container">
            <div class="section-title">
                <h2>${section.title}</h2>
                ${section.subtitle ? `<p>${section.subtitle}</p>` : ''}
            </div>
            <div class="content">
                ${section.content || '<p>这里是内容部分</p>'}
            </div>
        </div>
    </section>`;
  }).join('');
}