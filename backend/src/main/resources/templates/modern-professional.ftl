<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        @page {
            size: A4;
            margin: 0.5in;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
            font-size: 11pt;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .name {
            font-size: 24pt;
            font-weight: bold;
            color: #2c5aa0;
            margin-bottom: 5px;
        }
        
        .contact-info {
            font-size: 10pt;
            color: #666;
        }
        
        .section {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 14pt;
            font-weight: bold;
            color: #2c5aa0;
            border-bottom: 1px solid #2c5aa0;
            padding-bottom: 3px;
            margin-bottom: 10px;
        }
        
        .summary {
            text-align: justify;
            margin-bottom: 15px;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 5px;
            margin-bottom: 15px;
        }
        
        .skill-item {
            background-color: #f0f4f8;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 10pt;
            text-align: center;
        }
        
        .experience-item, .education-item {
            margin-bottom: 15px;
        }
        
        .job-title {
            font-weight: bold;
            font-size: 12pt;
            color: #2c5aa0;
        }
        
        .company {
            font-weight: bold;
            font-size: 11pt;
        }
        
        .date-range {
            font-style: italic;
            color: #666;
            font-size: 10pt;
            float: right;
        }
        
        .job-description {
            margin-top: 5px;
            text-align: justify;
        }
        
        .achievements {
            margin-top: 5px;
        }
        
        .achievement {
            margin-left: 15px;
            margin-bottom: 3px;
        }
        
        .degree {
            font-weight: bold;
            font-size: 11pt;
        }
        
        .institution {
            font-style: italic;
            color: #666;
        }
        
        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }
    </style>
</head>
<body>
    <!-- Header Section -->
    <div class="header">
        <div class="name">${personalInfo.fullName}</div>
        <div class="contact-info">
            ${personalInfo.email} | ${personalInfo.phone}<br>
            ${personalInfo.address}<br>
            <#if personalInfo.linkedIn??>
                ${personalInfo.linkedIn}<br>
            </#if>
            <#if personalInfo.website??>
                ${personalInfo.website}
            </#if>
        </div>
    </div>

    <!-- Professional Summary -->
    <#if summary??>
        <div class="section">
            <div class="section-title">PROFESSIONAL SUMMARY</div>
            <div class="summary">${summary}</div>
        </div>
    </#if>

    <!-- Core Competencies -->
    <#if skills?? && skills?size > 0>
        <div class="section">
            <div class="section-title">CORE COMPETENCIES</div>
            <div class="skills-grid">
                <#list skills as skill>
                    <div class="skill-item">${skill}</div>
                </#list>
            </div>
        </div>
    </#if>

    <!-- Professional Experience -->
    <#if experience?? && experience?size > 0>
        <div class="section">
            <div class="section-title">PROFESSIONAL EXPERIENCE</div>
            <#list experience as exp>
                <div class="experience-item clearfix">
                    <div class="job-title">${exp.position}</div>
                    <div class="date-range">
                        ${exp.startDate} - <#if exp.current>Present<#else>${exp.endDate}</#if>
                    </div>
                    <div class="company">${exp.company}</div>
                    <#if exp.description??>
                        <div class="job-description">${exp.description}</div>
                    </#if>
                    <#if exp.achievements?? && exp.achievements?size > 0>
                        <div class="achievements">
                            <#list exp.achievements as achievement>
                                <div class="achievement">• ${achievement}</div>
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
            <div class="section-title">EDUCATION</div>
            <#list education as edu>
                <div class="education-item clearfix">
                    <div class="degree">${edu.degree} in ${edu.field}</div>
                    <div class="date-range">${edu.endDate}</div>
                    <div class="institution">${edu.institution}</div>
                    <#if edu.gpa??>
                        <div>GPA: ${edu.gpa}</div>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>

    <!-- Footer -->
    <div style="text-align: center; font-size: 8pt; color: #999; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px;">
        Generated on ${generatedDate}
    </div>
</body>
</html>
