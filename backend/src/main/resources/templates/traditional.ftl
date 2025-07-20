<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        @page {
            size: A4;
            margin: 1in;
        }
        
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.4;
            color: #000;
            margin: 0;
            padding: 0;
            font-size: 12pt;
        }
        
        .header {
            text-align: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
        }
        
        .name {
            font-size: 20pt;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .contact-info {
            font-size: 11pt;
            line-height: 1.3;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .summary {
            text-align: justify;
            margin-bottom: 15px;
            text-indent: 20px;
        }
        
        .skills-paragraph {
            text-align: justify;
        }
        
        .experience-item, .education-item {
            margin-bottom: 15px;
        }
        
        .job-title {
            font-weight: bold;
            font-size: 12pt;
        }
        
        .company-date {
            font-style: italic;
            margin-bottom: 5px;
        }
        
        .job-description {
            margin-top: 5px;
            text-align: justify;
            text-indent: 20px;
        }
        
        .achievements {
            margin-top: 5px;
        }
        
        .achievement {
            margin-left: 30px;
            margin-bottom: 3px;
            list-style-type: disc;
        }
        
        .degree {
            font-weight: bold;
            font-size: 12pt;
        }
        
        .institution-date {
            font-style: italic;
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <!-- Header Section -->
    <div class="header">
        <div class="name">${personalInfo.fullName}</div>
        <div class="contact-info">
            ${personalInfo.address}<br>
            ${personalInfo.phone} | ${personalInfo.email}
            <#if personalInfo.linkedIn??>
                <br>${personalInfo.linkedIn}
            </#if>
            <#if personalInfo.website??>
                <br>${personalInfo.website}
            </#if>
        </div>
    </div>

    <!-- Objective/Summary -->
    <#if summary??>
        <div class="section">
            <div class="section-title">Objective</div>
            <div class="summary">${summary}</div>
        </div>
    </#if>

    <!-- Skills -->
    <#if skills?? && skills?size > 0>
        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-paragraph">
                <#list skills as skill>
                    ${skill}<#if skill_has_next>, </#if>
                </#list>
            </div>
        </div>
    </#if>

    <!-- Professional Experience -->
    <#if experience?? && experience?size > 0>
        <div class="section">
            <div class="section-title">Professional Experience</div>
            <#list experience as exp>
                <div class="experience-item">
                    <div class="job-title">${exp.position}</div>
                    <div class="company-date">
                        ${exp.company}, ${exp.startDate} - <#if exp.current>Present<#else>${exp.endDate}</#if>
                    </div>
                    <#if exp.description??>
                        <div class="job-description">${exp.description}</div>
                    </#if>
                    <#if exp.achievements?? && exp.achievements?size > 0>
                        <div class="achievements">
                            <#list exp.achievements as achievement>
                                <div class="achievement">${achievement}</div>
                            </#list>
                        </div>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>

    <!-- Education -->
    <#if education?? && education?size > 0>
        <div class="section">
            <div class="section-title">Education</div>
            <#list education as edu>
                <div class="education-item">
                    <div class="degree">${edu.degree} in ${edu.field}</div>
                    <div class="institution-date">
                        ${edu.institution}, ${edu.endDate}
                    </div>
                    <#if edu.gpa??>
                        <div>GPA: ${edu.gpa}</div>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>
</body>
</html>
