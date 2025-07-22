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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            margin: -40px -20px 40px -20px;
            text-align: center;
        }
        
        .name {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        .contact-info {
            font-size: 14px;
            margin-bottom: 5px;
            opacity: 0.9;
        }
        
        .contact-info a {
            color: white;
            text-decoration: none;
        }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-left: 4px solid #667eea;
            padding-left: 15px;
        }
        
        .summary {
            font-size: 15px;
            line-height: 1.8;
            color: #555;
            text-align: justify;
            background: #f8f9ff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 30px;
            background: #fafbff;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #764ba2;
        }
        
        .job-header, .edu-header, .project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        
        .job-title, .degree, .project-name {
            font-size: 18px;
            font-weight: 700;
            color: #667eea;
            margin-bottom: 5px;
        }
        
        .company, .institution {
            font-size: 15px;
            color: #764ba2;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .date {
            font-size: 13px;
            color: #888;
            background: white;
            padding: 5px 10px;
            border-radius: 15px;
            white-space: nowrap;
            border: 1px solid #e0e0e0;
        }
        
        .description {
            font-size: 14px;
            line-height: 1.7;
            color: #555;
            text-align: justify;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .skill-item {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
        }
        
        .certifications-list, .languages-list {
            list-style: none;
        }
        
        .cert-item, .lang-item {
            margin-bottom: 12px;
            font-size: 14px;
            color: #555;
            background: #f8f9ff;
            padding: 10px 15px;
            border-radius: 6px;
            border-left: 3px solid #667eea;
        }
        
        .cert-name, .lang-name {
            font-weight: 700;
            color: #667eea;
        }
        
        .technologies {
            font-size: 13px;
            color: #764ba2;
            margin-top: 8px;
            font-weight: 600;
        }
        
        @media print {
            body {
                padding: 20px;
            }
            .header {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
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
            <h2 class="section-title">Core Skills</h2>
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
            <h2 class="section-title">Professional Experience</h2>
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
            <h2 class="section-title">Key Projects</h2>
            <#list projects as project>
                <div class="project-item">
                    <div class="project-header">
                        <div>
                            <div class="project-name">${project.name}</div>
                            <#if project.technologies?has_content>
                                <div class="technologies">Tech Stack: ${project.technologies?join(" • ")}</div>
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
