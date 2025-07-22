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
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.5;
            color: #000;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 20px;
        }
        
        .name {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .contact-info {
            font-size: 12px;
            margin-bottom: 3px;
        }
        
        .contact-info a {
            color: #000;
            text-decoration: none;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            text-decoration: underline;
            text-align: center;
        }
        
        .summary {
            font-size: 12px;
            line-height: 1.6;
            text-align: justify;
            text-indent: 20px;
        }
        
        .experience-item, .education-item, .project-item {
            margin-bottom: 20px;
        }
        
        .job-header, .edu-header, .project-header {
            margin-bottom: 5px;
        }
        
        .job-title, .degree, .project-name {
            font-size: 13px;
            font-weight: bold;
            display: inline;
        }
        
        .company, .institution {
            font-size: 12px;
            font-style: italic;
            display: inline;
            margin-left: 10px;
        }
        
        .date {
            font-size: 11px;
            float: right;
        }
        
        .description {
            font-size: 11px;
            line-height: 1.5;
            text-align: justify;
            margin-top: 5px;
            clear: both;
        }
        
        .skills-list {
            font-size: 11px;
            line-height: 1.6;
            text-align: justify;
        }
        
        .certifications-list, .languages-list {
            list-style: none;
            font-size: 11px;
        }
        
        .cert-item, .lang-item {
            margin-bottom: 5px;
        }
        
        .cert-name, .lang-name {
            font-weight: bold;
        }
        
        .technologies {
            font-size: 10px;
            font-style: italic;
            margin-top: 3px;
        }
        
        @media print {
            body {
                padding: 20px;
                font-size: 11px;
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
        <#if personalInfo.address?has_content>
            <div class="contact-info">${personalInfo.address}</div>
        </#if>
        <#if personalInfo.phone?has_content>
            <div class="contact-info">${personalInfo.phone}</div>
        </#if>
        <#if personalInfo.email?has_content>
            <div class="contact-info">
                <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
            </div>
        </#if>
        <#if personalInfo.linkedIn?has_content>
            <div class="contact-info">
                <a href="${personalInfo.linkedIn}">${personalInfo.linkedIn}</a>
            </div>
        </#if>
    </div>

    <!-- Objective/Summary -->
    <#if summary?has_content>
        <div class="section">
            <h2 class="section-title">Objective</h2>
            <div class="summary">${summary}</div>
        </div>
    </#if>

    <!-- Work Experience -->
    <#if experience?has_content && (experience?size > 0)>
        <div class="section">
            <h2 class="section-title">Experience</h2>
            <#list experience as exp>
                <div class="experience-item">
                    <div class="job-header">
                        <span class="job-title">${exp.jobTitle!exp.position!""}</span>
                        <span class="company">${exp.company}</span>
                        <span class="date">${exp.startDate} - ${formatDate(exp.endDate)}</span>
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
                        <span class="degree">${edu.degree}</span>
                        <span class="institution">${edu.institution}</span>
                        <span class="date">${edu.year!edu.endDate!""}</span>
                    </div>
                    <#if edu.field?has_content>
                        <div class="description">${edu.field}</div>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>

    <!-- Skills -->
    <#if skills?has_content && (skills?size > 0)>
        <div class="section">
            <h2 class="section-title">Skills</h2>
            <div class="skills-list">
                ${skills?join(", ")}
            </div>
        </div>
    </#if>

    <!-- Projects -->
    <#if projects?has_content && (projects?size > 0)>
        <div class="section">
            <h2 class="section-title">Projects</h2>
            <#list projects as project>
                <div class="project-item">
                    <div class="project-header">
                        <span class="project-name">${project.name}</span>
                        <#if project.endDate?has_content>
                            <span class="date">${project.startDate!""} - ${project.endDate}</span>
                        </#if>
                    </div>
                    <#if project.description?has_content>
                        <div class="description">${project.description}</div>
                    </#if>
                    <#if project.technologies?has_content>
                        <div class="technologies">Technologies: ${project.technologies?join(", ")}</div>
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
                        <span class="cert-name">${cert.name}</span>, ${cert.issuer}
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
                        <span class="lang-name">${lang.name}</span>: ${lang.proficiency}
                    </li>
                </#list>
            </ul>
        </div>
    </#if>
</body>
</html>
