<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 1px solid #eee;
            padding-bottom: 30px;
        }
        
        .name {
            font-size: 32px;
            font-weight: 300;
            margin-bottom: 10px;
            color: #2c3e50;
            letter-spacing: 1px;
        }
        
        .contact-info {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }
        
        .contact-info a {
            color: #666;
            text-decoration: none;
        }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .summary {
            font-size: 15px;
            line-height: 1.7;
            color: #555;
            text-align: justify;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 25px;
        }
        
        .job-header, .edu-header, .project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
        }
        
        .job-title, .degree, .project-name {
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
        }
        
        .company, .institution {
            font-size: 14px;
            color: #666;
            font-style: italic;
            margin-bottom: 8px;
        }
        
        .date {
            font-size: 13px;
            color: #888;
            white-space: nowrap;
        }
        
        .description {
            font-size: 14px;
            line-height: 1.6;
            color: #555;
            text-align: justify;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-item {
            background: #f8f9fa;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 13px;
            color: #555;
            border: 1px solid #e9ecef;
        }
        
        .certifications-list, .languages-list {
            list-style: none;
        }
        
        .cert-item, .lang-item {
            margin-bottom: 8px;
            font-size: 14px;
            color: #555;
        }
        
        .cert-name, .lang-name {
            font-weight: 600;
            color: #2c3e50;
        }
        
        .technologies {
            font-size: 13px;
            color: #666;
            margin-top: 5px;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <h1 class="name">${personalInfo.fullName}</h1>
        <#if personalInfo.email?has_content>
            <div class="contact-info">
                <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
            </div>
        </#if>
        <#if personalInfo.phone?has_content>
            <div class="contact-info">${personalInfo.phone}</div>
        </#if>
        <#if personalInfo.address?has_content>
            <div class="contact-info">${personalInfo.address}</div>
        </#if>
        <#if personalInfo.linkedIn?has_content>
            <div class="contact-info">
                <a href="${personalInfo.linkedIn}">${personalInfo.linkedIn}</a>
            </div>
        </#if>
        <#if personalInfo.github?has_content>
            <div class="contact-info">
                <a href="${personalInfo.github}">${personalInfo.github}</a>
            </div>
        </#if>
    </div>

    <!-- Professional Summary -->
    <#if summary?has_content>
        <div class="section">
            <h2 class="section-title">Professional Summary</h2>
            <div class="summary">${summary}</div>
        </div>
    </#if>

    <!-- Skills -->
    <#if skills?has_content && (skills?size > 0)>
        <div class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-list">
                <#list skills as skill>
                    <span class="skill-item">${skill}</span>
                </#list>
            </div>
        </div>
    </#if>

    <!-- Work Experience -->
    <#if experience?has_content && (experience?size > 0)>
        <div class="section">
            <h2 class="section-title">Work Experience</h2>
            <#list experience as exp>
                <div class="experience-item">
                    <div class="job-header">
                        <div>
                            <div class="job-title">${exp.jobTitle!exp.position!""}</div>
                            <div class="company">${exp.company}</div>
                        </div>
                        <div class="date">
                            ${exp.startDate} - ${formatDate(exp.endDate)}
                        </div>
                    </div>
                    <#if exp.description?has_content>
                        <div class="description">${exp.description}</div>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>

    <!-- Education -->
    <#if education?has_content && (education?size > 0)>
        <div class="section">
            <h2 class="section-title">Education</h2>
            <#list education as edu>
                <div class="education-item">
                    <div class="edu-header">
                        <div>
                            <div class="degree">${edu.degree}</div>
                            <div class="institution">${edu.institution}</div>
                        </div>
                        <div class="date">${edu.year!edu.endDate!""}</div>
                    </div>
                    <#if edu.field?has_content>
                        <div class="description">${edu.field}</div>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>

    <!-- Projects -->
    <#if projects?has_content && (projects?size > 0)>
        <div class="section">
            <h2 class="section-title">Projects</h2>
            <#list projects as project>
                <div class="project-item">
                    <div class="project-header">
                        <div>
                            <div class="project-name">${project.name}</div>
                            <#if project.technologies?has_content>
                                <div class="technologies">Technologies: ${project.technologies?join(", ")}</div>
                            </#if>
                        </div>
                        <#if project.endDate?has_content>
                            <div class="date">${project.startDate!""} - ${project.endDate}</div>
                        </#if>
                    </div>
                    <#if project.description?has_content>
                        <div class="description">${project.description}</div>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>

    <!-- Certifications -->
    <#if certifications?has_content && (certifications?size > 0)>
        <div class="section">
            <h2 class="section-title">Certifications</h2>
            <ul class="certifications-list">
                <#list certifications as cert>
                    <li class="cert-item">
                        <span class="cert-name">${cert.name}</span> - ${cert.issuer}
                        <#if cert.date?has_content> (${cert.date})</#if>
                    </li>
                </#list>
            </ul>
        </div>
    </#if>

    <!-- Languages -->
    <#if languages?has_content && (languages?size > 0)>
        <div class="section">
            <h2 class="section-title">Languages</h2>
            <ul class="languages-list">
                <#list languages as lang>
                    <li class="lang-item">
                        <span class="lang-name">${lang.name}</span> - ${lang.proficiency}
                    </li>
                </#list>
            </ul>
        </div>
    </#if>
</body>
</html>
