let data = {}; // This will hold your JSON data
let currentLanguage = 'en'; // Default language

async function fetchData() {
    try {
        const response = await fetch('https://arnaudlemascon.fr/assets/json/data.json');
        data = await response.json();
        console.log('Data loaded:', data); // Ajoutez ce log
        generateContent();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function generateContent() {
    generateArticle();
    generateProjects();
    generateValues();
    generateSkills();
}

function changeLanguage(language) {
    currentLanguage = language;
    generateContent();
}

function generateArticle() {
    console.log('Generating articles...'); // Ajoutez ce log
    const sections = {
        'HOME': document.querySelector('#HOME #article-container'),
        'SKILLS': document.querySelector('#SKILLS .skills-container'),
    };

    if (data.Article && Array.isArray(data.Article)) {
        console.log('Articles:', data.Article); // Ajoutez ce log
        Object.values(sections).forEach(container => container.innerHTML = '');

        data.Article.forEach(article => {
            const container = sections[article.section];
            if (container) {
                const articleHTML = `
                    <div class="article-item">
                        <h2>${article.name[currentLanguage]}</h2>
                        <p>${article.description[currentLanguage]}</p>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', articleHTML);
            } else {
                console.warn(`Section "${article.section}" not found.`);
            }
        });
    } else {
        Object.values(sections).forEach(container => {
            container.innerHTML = '<p>No articles available.</p>';
        });
    }
}

function generateProjects() {
    const container = document.querySelector('#PROJECTS .project-container');
    container.innerHTML = '';

    if (data.projects && Array.isArray(data.projects)) {
        data.projects.forEach(project => {
            const technoHTML = project.techno ? project.techno.map(techno => `<div class="techno-label" id="${techno}">${techno}</div>`).join('') : '';

            const projectHTML = `
                <div class="cards">
                    <div class="img-box">
                        <img src="${project.image}" alt="Image">
                    </div>
                    <div class="text-box">
                        <a href="#">${project.name[currentLanguage]}</a>
                        <div class="techno-box">
                            ${technoHTML}
                        </div>
                        <p>${project.description[currentLanguage]}</p>
                    </div>
                </div>
            `;

            container.insertAdjacentHTML('beforeend', projectHTML);
        });
    } else {
        container.innerHTML = '<p>No projects available.</p>';
    }
}

function generateValues() {
    const container = document.querySelector('#VALUES .container-values .row');
    container.innerHTML = ''; // Clear the container

    if (data.values && Array.isArray(data.values)) {
        data.values.forEach(value => {
            const valueHTML = `
                <div class="col-6 col-md-4 mb-4">
                    <div class="carte">
                        <div class="carte-inner">
                            <div class="face face-avant">
                                <img src="${value.image}" alt="Image">
                                <div class="value">${value.name[currentLanguage]}</div>
                            </div>
                            <div class="face face-arriere">
                                <p>${value.description[currentLanguage]}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            container.insertAdjacentHTML('beforeend', valueHTML);
        });
    } else {
        container.innerHTML = '<p>No values available.</p>';
    }
}

function generateSkills() {
    const container = document.querySelector('#SKILLS .skills-container');
    container.innerHTML = ''; // Clear the container

    // Group skills by type
    const groupedSkills = {
        'OS': [],
        'DEV': [],
        'Langues': []
    };

    for (const key in data.skills) {
        if (data.skills.hasOwnProperty(key)) {
            const skill = data.skills[key];
            if (skill.type === 'development') {
                // Assuming you categorize based on a specific set of skill types
                groupedSkills['DEV'].push(skill);
            } else if (skill.type === 'language') {
                groupedSkills['Langues'].push(skill);
            } else {
                // You can add more categories here if needed
                groupedSkills['OS'].push(skill);
            }
        }
    }

    // Function to create HTML for a skill group
    const createSkillGroupHTML = (type, skills) => {
        if (skills.length === 0) return '';

        const skillsHTML = skills.map(skill => `
            <div class="gauge-wrapper">
                ${skill.name[currentLanguage]}
                <div class="gauge">
                    <div class="gauge-level" style="width:${skill.level}%"></div>
                </div>
            </div>
        `).join('<div class="separator"></div>');

        return `
            <div class="col-2 card_skills">
                <div class="card_skills-type">${type}</div>
                ${skillsHTML}
            </div>
        `;
    };

    // Generate HTML for each skill group
    const osSkillsHTML = createSkillGroupHTML('OS', groupedSkills['OS']);
    const devSkillsHTML = createSkillGroupHTML('DEV', groupedSkills['DEV']);
    const languageSkillsHTML = createSkillGroupHTML('Langues', groupedSkills['Langues']);

    // Combine all skill groups and insert into container
    container.innerHTML = `
        <div class="row">
            ${osSkillsHTML}
            ${devSkillsHTML}
            ${languageSkillsHTML}
        </div>
    `;
}

fetchData();
