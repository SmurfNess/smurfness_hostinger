let data = {}; // This will hold your JSON data
let currentLanguage = 'en'; // Default language

// Fetch JSON data from the server
async function fetchData() {
    try {
        const response = await fetch('https://arnaudlemascon.fr/assets/json/data.json');
        const jsonData = await response.json();
        console.log('JSON fetched:'/*, JSON.stringify(jsonData, null, 2)*/);
        
        data = jsonData;
        generateContent(); // Call the function to generate content based on the data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Generate all content sections
function generateContent() {
    generateNavbar();
    generateArticle();
    generateProjects();
    generateValues();
    generateSkills();
    generateContactForm();
}

// Generate the navbar menu
document.addEventListener("DOMContentLoaded", function () {
    generateNavbar();
    addNavbarLineAnimation();
});

function addNavbarLineAnimation() {
    const nav = document.querySelector("#navbar-menu");
    const line = document.createElement("div");
    line.classList.add("line");
    nav.appendChild(line);

    let active = nav.querySelector(".active");
    let pos = 0;
    let wid = 0;

    // Initialiser la ligne sous l'élément actif si trouvé
    if (active) {
        pos = active.offsetLeft;
        wid = active.offsetWidth;
        line.style.left = pos + "px";
        line.style.width = wid + "px";
    }

    nav.querySelectorAll("li a").forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const parent = link.parentElement;
            if (!parent.classList.contains("active") && !nav.classList.contains("animate")) {
                nav.classList.add("animate");

                // Enlever la classe active de tous les éléments
                nav.querySelectorAll("li").forEach(function (li) {
                    li.classList.remove("active");
                });

                const newPosition = parent.offsetLeft;
                const newWidth = parent.offsetWidth;

                // Calculer la position de départ et la largeur pour l'extension de la ligne
                const startLeft = Math.min(pos, newPosition);
                const endWidth = Math.abs(newPosition - pos) + newWidth;

                // Etape 1 : Étendre la ligne pour couvrir la distance entre les deux éléments
                line.style.transition = "none";
                line.style.left = pos + "px";
                line.style.width = wid + "px";
                setTimeout(function () {
                    line.style.transition = "all 300ms";
                    line.style.left = startLeft + "px";
                    line.style.width = endWidth + "px";

                    // Etape 2 : Rétracter la ligne pour ne couvrir que le nouvel élément actif
                    setTimeout(function () {
                        line.style.transition = "width 150ms, left 150ms";
                        line.style.left = newPosition + "px";
                        line.style.width = newWidth + "px";

                        setTimeout(function () {
                            nav.classList.remove("animate");
                            parent.classList.add("active");
                        }, 150);
                    }, 300);
                }, 10);

                // Mettre à jour les positions
                pos = newPosition;
                wid = newWidth;
            }
        });
    });
}

function generateNavbar() {
    const navbarMenu = document.getElementById('navbar-menu');  // Conteneur pour les éléments <li>

    if (navbarMenu) {
        navbarMenu.innerHTML = ''; // Clear existing menu items

        const menuItems = [
            { id: 'HOME', text: 'Home' },
            { id: 'PROJECTS', text: 'Projects' },
            { id: 'VALUES', text: 'Values' },
            { id: 'SKILLS', text: 'Skills' },
            { id: 'CONTACT', text: 'Contact' }
        ];

        menuItems.forEach((item, index) => {
            const isActive = item.id === 'HOME'; // Set 'HOME' as active by default
            const menuItemHTML = `
                <li class="nav-item${isActive ? ' active' : ''}">
                    <a class="nav-link" href="#${item.id}" onclick="scrollToSection('${item.id}')">${item.text}</a>
                </li>
            `;
            navbarMenu.insertAdjacentHTML('beforeend', menuItemHTML);  // Insert items into the <ul>
        });

        // Initialize underline animation after generating the menu
        addNavbarLineAnimation();  // Assuming this function exists in your JS
    } else {
        console.warn('Navbar menu container not found.');
    }
}


// Function to add event listeners to the nav-links
function addNavbarLinkEventListeners() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            setActiveLink(event);
            closeNavbar();
        });
    });
}

// Scroll smoothly to a section when a link is clicked
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const offset = 80; // Hauteur de la navbar en pixels
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition - offset;

    window.scrollBy({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Close the navbar if the toggler is visible (for responsive behavior)
function closeNavbar() {
    if ($('.navbar-toggler').is(':visible')) {
        $('.navbar-toggler').click(); // Simulate a click on the toggler to close the navbar
    }
}

// Change language and regenerate content
function changeLanguage(language) {
    currentLanguage = language;
    generateContent();

    const buttons = {
        'en': document.getElementById('btn-en'),
        'fr': document.getElementById('btn-fr'),
        'sp': document.getElementById('btn-sp')
    };

    // Loop through each button, hide the active language button and show others
    for (let lang in buttons) {
        if (lang === language) {
            buttons[lang].style.display = 'none';  // Hide the active language button
        } else {
            buttons[lang].style.display = 'inline-block';  // Show other language buttons
        }
    }
}

function generateArticle() {
    console.log('Generating articles...');
    const sections = {
        'HOME': document.querySelector('#HOME'),
        'PROJECTS': document.querySelector('#PROJECTS'),
        'VALUES': document.querySelector('#VALUES'),
        'SKILLS': document.querySelector('#SKILLS'),
        'CONTACT': document.querySelector('#CONTACT'),
    };

    // Log the height of each main section in pixels
    Object.entries(sections).forEach(([sectionName, section]) => {
        if (section) {
            console.log(`Height of ${sectionName}: ${section.offsetHeight}px`);

            // Log the height of each section
            const sectionHeight = section.offsetHeight;  // Get the height of the section
            console.log(`Height of section "${sectionName}": ${sectionHeight}px`);

            // Position of article-container
            const articleContainer = section.querySelector('.article-container');
            if (articleContainer) {
                const rect = articleContainer.getBoundingClientRect();
                const sectionRect = section.getBoundingClientRect();
                const positionFromTop = rect.top - sectionRect.top; // Position relative to the section
                console.log(`Position of article-container in ${sectionName} from top: ${positionFromTop}px`);

                // Adjust the position of SVGs in specific sections
                if (sectionName === 'PROJECTS' || sectionName === 'VALUES' || sectionName === 'SKILLS') {
                    const svgElements = section.querySelectorAll('svg');
                    svgElements.forEach(svg => {
                        svg.style.position = 'absolute';
                        svg.style.top = `${positionFromTop}px`;
                        svg.style.left = '0'; 
                        console.log(`Adjusted position of SVG in ${sectionName} to top: ${positionFromTop - 250}px`);

                        // Log the height of each SVG
                        const svgRect = svg.getBoundingClientRect();
                        console.log(`Height of SVG in ${sectionName}: ${svgRect.height}px`);
                    });
                }
            } else {
                console.warn(`Article container not found in section "${sectionName}".`);
            }

            // Position of SVG elements
            const svgElements = section.querySelectorAll('svg'); // Select all SVG elements in the section
            svgElements.forEach((svg, index) => {
                const rect = svg.getBoundingClientRect();
                const sectionRect = section.getBoundingClientRect();
                const positionFromTop = rect.top - sectionRect.top; // Position relative to the section
                console.log(`Position of SVG ${index + 1} in ${sectionName} from top: ${positionFromTop}px`);

                // Log the height of each SVG
                console.log(`Height of SVG ${index + 1} in ${sectionName}: ${rect.height}px`);
            });
        } else {
            console.warn(`Section "${sectionName}" not found.`);
        }
    });

    if (data && data.Article && Array.isArray(data.Article)) {
        Object.values(sections).forEach(section => {
            const container = section.querySelector('.article-container');
            if (container) {
                container.innerHTML = ''; // Clear container
            }
        });

        data.Article.forEach(article => {
            const section = sections[article.section];
            if (section) {
                const container = section.querySelector('.article-container');
                if (container) {
                    const articleHTML = `
                    <div class="article-item generated-font">
                        <h2>${article.name ? article.name[currentLanguage] : 'No name'}</h2>
                        ${article.description ? `<h6>${article.description[currentLanguage]}</h6>` : ''}
                    </div>
                    `;
                    container.insertAdjacentHTML('beforeend', articleHTML);
                } else {
                    console.warn(`Article container not found for section "${article.section}".`);
                }
            } else {
                console.warn(`Section "${article.section}" not found.`);
            }
        });
    } else {
        Object.values(sections).forEach(section => {
            const container = section.querySelector('.article-container');
            if (container) {
                container.innerHTML = '<p>No articles available.</p>';
            }
        });
    }

    // Log the updated height of each main section after articles have been inserted
    Object.entries(sections).forEach(([sectionName, section]) => {
        if (section) {
            console.log(`Updated height of ${sectionName}: ${section.offsetHeight}px`);
        }
    });
}

// Generate project items
function generateProjects() {
    const container = document.querySelector('#PROJECTS .project-container');
    if (container) {
        container.innerHTML = ''; // Clear the container

        data.projects.forEach(project => {
            const technoHTML = project.techno.map(techno => `<div class="techno-label" id="${techno}">${techno}</div>`).join('');

            const projectHTML = `
            <div class="col-4">
                <div class="cards generated-font">
                    <div class="img-box">
                        <img src="${project.image}" alt="Image">
                    </div>
                    <div class="text-box">
                        <a href="${project.link}" target="_blank" >${project.name[currentLanguage]}</a>
                        <div class="techno-box">
                            ${technoHTML}
                        </div>
                        <p class="generated-font">${project.description[currentLanguage]}</p>
                    </div>
                </div>
            </div>  
            `;

            container.insertAdjacentHTML('beforeend', projectHTML);
        });
    } else {
        console.warn('Project container not found.');
    }
}

// Generate value items
function generateValues() {
    const container = document.querySelector('#VALUES .values-container');

    if (container) {
        container.innerHTML = ''; // Clear the container

        data.values.forEach(value => {
            const valueHTML = `
                <div class="col-5 col-md-3 d-flex justify-content-center align-items-center generated-font">
                    <div class="carte generated-font">
                        <div class="carte-inner">
                            <div class="face face-avant generated-font">
                                <img src="${value.image}" alt="Image">
                                <div class="value">${value.name[currentLanguage]}</div>
                            </div>
                            <div class="face face-arriere generated-font">
                                <p>${value.description[currentLanguage]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', valueHTML);
        });
    } else {
        console.warn('Values container not found.');
    }
}

// Generate skills
function generateSkills() {
    const container = document.querySelector('#SKILLS .skills-container');
    if (container) {
        container.innerHTML = ''; // Clear existing content

        // Object to collect skills by their type
        const skillTypes = {};

        // Organize skills into skillTypes object
        for (const key in data.skills) {
            const skill = data.skills[key];
            if (!skillTypes[skill.type]) {
                skillTypes[skill.type] = [];
            }
            skillTypes[skill.type].push(skill);
        }

        // Generate a card for each unique type
        for (const [type, skills] of Object.entries(skillTypes)) {
            // Use the type name as the card title (you can customize this logic if needed)
            const typeTitle = type.charAt(0).toUpperCase() + type.slice(1);

            // Create the HTML structure for this type
            const typeHTML = `
                <div class="col-lg-2 col-md-4 col-sm-12 card_skills">
                    <div class="card_skills-type">${typeTitle}</div>
                    ${skills.map(skill => `
                        <div class="gauge-wrapper">
                            ${skill.name[currentLanguage]}
                            <div class="gauge">
                                <div class="gauge-level" style="width:${skill.level}%"></div>
                            </div>
                        </div>
                    `).join('<div class="separator"></div>')}
                </div>
            `;

            // Add the card to the container
            container.insertAdjacentHTML('beforeend', typeHTML);
        }
    } else {
        console.warn('Skills container not found.');
    }
}

// Generate the contact form
function generateContactForm() {
    const container = document.querySelector('#CONTACT .contact-container');
    if (!container) {
      console.warn('Contact container not found.');
      return;
    }

    if (!data || !data.Article) {
      console.error('Data or data.Article is not defined.');
      return;
    }

    // Trouver la section CONTACT dans les articles
    const contactSection = data.Article.find(article => article.section === 'CONTACT');
    if (!contactSection) {
      console.warn('Contact section data not found.');
      return;
    }

    // Générer le HTML du formulaire
    const contactHTML = `
            <form action="https://formspree.io/f/xdovyzdp" method="POST">
                <label class="col-12 generated-font">${contactSection.identity[currentLanguage]}<br>
                    <input type="name" name="name" placeholder="${contactSection.identity[currentLanguage]}" required>
                </label>
                <label class="col-12 generated-font" for="email">${contactSection.expeditor[currentLanguage]}<br>
                    <input type="email" name="email"id="email" placeholder="${contactSection.expeditor[currentLanguage]}" required>
                </label>
                <label class="col-12 generated-font" for="message">${contactSection.message[currentLanguage]}<br>
                    <textarea name="message"id="message" rows="3" placeholder="${contactSection.message[currentLanguage]}" required></textarea>
                </label>
                <button type="submit" class="btn-message">${contactSection.btn[currentLanguage]}</button>
            </form>
    `;

    /*
            <form action="https://formspree.io/f/xdovyzdp" method="POST">
            <label>Ton nom et tes pronoms :<br>
              <input type="name" name="name" required>
            </label>
            <label>Ton email :<br>
              <input type="email" name="email" required>
            </label>
            <label class=" message">Ton message :<br>
              <textarea name="message" rows="8" cols="0"></textarea required>
            </label>
            <div>
              <button type="submit">SEND</button>
            </div>
          </form>
    */

    // Insérer le formulaire dans le conteneur
    container.innerHTML = contactHTML;
}

// Fetch data when the script is loaded
fetchData();
