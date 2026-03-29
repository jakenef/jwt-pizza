# Curiosity Report: Dynatrace / Davis AI

## Introduction

You just worked a long friday shift that was stressful as an engineer. You come home, finally ready to relax and go to sleep. Suddenly, alarms are blaring and you are summoned out of bed with scary notifications and emails about outages and problems in the system you're in charge of. With a sigh, you open your laptop and rub your bleary eyes because you realize your friday night is now going to be a stressful debugging session instead of a relaxing sleep. I wanted to do a report on Dynatrace because it is a tool that solves this problem-- by using AI to recover from system problems so humans don't even have to be in the loop.

## What is Dynatrace?

Dynatrace is an AI-powered observability platform that automatically monitors, analyzes, and optimizes the performance of cloud applications, infrastructure, and user experiences. It uses Davis AI to discover and map all components in your environment (like servers, services, etc), detect anomalies, perform automated root cause analysis, and suggest or trigger self-healing actions.

Key points:

- **Self-Healing Automation**: Dynatrace can trigger a remediation runbook (via Ansible, Terraform, cloud API, etc.), update a ServiceNow ticket, and post Slack/Teams updates, all without human intervention [source](https://www.dynatrace.com/news/blog/automated-remediation-with-ansible-automation/)
- **Full-Stack Observability**: Dynatrace ingests 100% of telemetry (metrics, logs, traces, events) and uses AI to baseline normal behavior, detect anomalies, and correlate related issues into a single, actionable problem.
- **Root Cause Analysis**: Instead of just alerting, Davis AI traces through dependencies and uses causal reasoning to identify the true source of an issue, not just the symptoms.
- **Closed-Loop Remediation**: After a fix, Dynatrace validates if the problem is resolved. If not, it can retry, roll back, or escalate to humans, ensuring issues are actually fixed—not just hidden.

## How Dynatrace Works

1. **Monitor Everything**: Dynatrace agents collect data from all parts of your system (apps, servers, cloud, etc.).
2. **Detect Anomalies**: Davis AI learns what “normal” looks like and flags anything unusual, like a spike in errors or slowdowns.
3. **Analyze & Correlate**: It groups related issues together and runs root-cause analysis to find what’s really broken.
4. **Trigger Automation**: If configured, Dynatrace launches a runbook or workflow to fix the problem automatically (e.g., restart a service, scale up, or roll back a change).
5. **Validate & Escalate**: Dynatrace checks if the fix worked. If not, it can try again or alert an engineer.

## Why It’s Great

- **Fewer Wake-Ups**: Many incidents are fixed automatically, so engineers only get paged for truly new or complex problems.
- **Faster Recovery**: Mean Time to Repair (MTTR) drops dramatically. Some companies report 30–50% faster fixes and fewer outages. [source](https://www.dynatrace.com/news/blog/why-aiops-and-digital-transformation-are-modernizing-bt/#:~:text=Combining%20AIOps%20and%20digital%20transformation,value%E2%80%9D%20and%20return%20on%20investment)
- **Less Alert Noise**: Related alerts are grouped, and recurring “noisy” issues are suppressed unless they get worse.
- **Auditability**: Every automated action is logged and linked to the original problem for easy review.

## Challenges

- **Requires Full Observability**: You need to instrument all parts of your stack so the AI has enough data to work with.
- **Safe Automation Needs Guardrails**: Automated fixes must be carefully tested and use least-privilege credentials to avoid causing bigger problems.
- **Tuning & Trust**: Teams need to review and tune detection settings, and build trust in the AI’s diagnoses before going fully hands-off.
- **Integration Overhead**: Setting up runbooks and connecting external tools (like Ansible or ServiceNow) takes some initial effort.

## Tools & Integrations

- **Dynatrace Workflows**: Define automated remediation steps and connect to external systems.
- **Ansible, Terraform, AWS, Azure, Kubernetes**: Used for orchestration and making changes in the environment.
- **ServiceNow, Jira, Slack, Teams**: For ticketing and notifications.
- **Grafana, Prometheus**: For additional metrics and dashboards (Dynatrace also has built-in visualization).

## Connection to Our Course

- **Observability**: Dynatrace’s approach builds on the same metrics, logs, and traces we used, but adds AI and automation.
- **Automation**: Like our CI/CD pipelines, but for incident response and self-healing.
- **Testing in Production**: Dynatrace validates fixes live, similar to how we had a CI rule for tests passing.

## Cool Facts

- **Real-World Impact**: Companies like BT, Coca-Cola Hellenic, and Pasco County have reported 30–50% faster incident resolution and far fewer critical outages after enabling Dynatrace automation.
- **Closed-Loop**: Dynatrace not only fixes issues but checks that the fix worked, and can roll back or escalate if not.
- **Industry Leader**: Davis AI is considered one of the most mature AIOps engines, with years of development and analyst recognition.

## What I Think

Dynatrace is a game-changer for on-call engineers. The idea of “waking up to good news” because the AI fixed a problem overnight is awesome. I like how it combines observability with real automation, not just alerting. The hardest part is making sure automations are safe and well-tested, but the payoff is huge: less stress, fewer outages, and more time for real engineering work.

## Conclusion

Dynatrace and Davis AI bring true autonomous remediation to modern operations. By combining full-stack observability, smart root-cause analysis, and safe automation, they help teams sleep better and focus on building, not firefighting. This fits perfectly with what we’ve learned about observability, automation, and incident response—and shows where the future of ops is headed.
