<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Resume</title>
    <style>
        @page {
            size: A4;
            margin: 0.75in;
        }
        
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.5;
            color: #333;
            margin: 0;
            padding: 0;
            font-size: 11pt;
        }
        
        .header {
            margin-bottom: 30px;
        }
        
        .name {
            font-size: 28pt;
            font-weight: 300;
            color: #000;
            margin-bottom: 10px;
            letter-spacing: 1px;
        }
        
        .contact-info {
            font-size: 10pt;
            color: #666;
            line-height: 1.3;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 12pt;
            font-weight: 600;
            color: #000;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #000;
        }
        
        .summary {
            text-align: justify;
            margin-bottom: 20px;
            font-size: 11pt;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
        }
        
        .skill-item {
            font-size: 10pt;
            color: #555;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
        }
        
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
        }
        
        .job-title {
            font-weight: 600;
            font-size: 12pt;
            color: #000;
        }
        
        .company {
            font-size: 11pt;
            color: #666;
            margin-bottom: 5px;
        }
        
        .date-range {
            font-size: 10pt;
            color: #999;
        }
        
        .job-description {
            margin-top: 8px;
            text-align: justify;
            font-size: 10pt;
        }
        
        .achievements {
            margin-top: 8px;
        }
        
        .achievement {
            margin-left: 20px;
            margin-bottom: 3px;
            font-size: 10pt;
            position: relative;
        }
        
        .achievement::before {
            content: "—";
            position: absolute;
            left: -15px;
        }
        
        .education-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
        }
        
        .degree {
            font-weight: 600;
            font-size: 11pt;
            color: #000;
        }
        
        .institution {
            font-size: 10pt;
            color: #666;
            margin-top: 2px;
        }
    </style>
</head>
<body>
    <!-- Header Section -->
    <div class="header">
        <div class="name">${personalInfo.fullName}</div>
        <div class="contact-info">
            ${personalInfo.email} • ${personalInfo.phone} • ${personalInfo.address}
            <#if personalInfo.linkedIn??>
                <br>${personalInfo.linkedIn}
            </#if>
            <#if personalInfo.website??>
                <#if personalInfo.linkedIn??> • <#else><br></#if>${personalInfo.website}
            </#if>
        </div>
    </div>

    <!-- Professional Summary -->
    <#if summary??>
        <div class="section">
            <div class="section-title">Summary</div>
            <div class="summary">${summary}</div>
        </div>
    </#if>

    <!-- Skills -->
    <#if skills?? && skills?size > 0>
        <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills-list">
                <#list skills as skill>
                    <span class="skill-item">${skill}</span>
                </#list>
            </div>
        </div>
    </#if>

    <!-- Experience -->
    <#if experience?? && experience?size > 0>
        <div class="section">
            <div class="section-title">Experience</div>
            <#list experience as exp>
                <div class="experience-item">
                    <div class="job-header">
                        <div class="job-title">${exp.position}</div>
                        <div class="date-range">
                            ${exp.startDate} — <#if exp.current>Present<#else>${exp.endDate}</#if>
                        </div>
                    </div>
                    <div class="company">${exp.company}</div>
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
                    <div class="education-header">
                        <div class="degree">${edu.degree} in ${edu.field}</div>
                        <div class="date-range">${edu.endDate}</div>
                    </div>
                    <div class="institution">${edu.institution}</div>
                    <#if edu.gpa??>
                        <div style="font-size: 10pt; color: #666; margin-top: 2px;">GPA: ${edu.gpa}</div>
                    </#if>
                </div>
            </#list>
        </div>
    </#if>
</body>
</html>
