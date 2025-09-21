\ = 'pg-e-permit-fargate-cluster'
\ = 'pg-e-permit-backend-service'
\ = 'us-east-1'
\ = 'arn:aws:elasticloadbalancing:us-east-1:471112842948:targetgroup/pge-target-5000-tg-alb-vpc-ip/35af6046993355ba'

\ = aws ecs list-tasks --cluster \ --service-name \ --desired-status RUNNING --region \ --query 'taskArns' --output text

if (-not \) {
  Write-Host 'No running tasks found to register.'
  exit
}

\ = aws ecs describe-tasks --cluster \ --tasks \ --region \ --query 'tasks[].attachments[].details[?name==privateIPv4Address].value' --output text

foreach (\ in \ -split '\s+') {
  if ([string]::IsNullOrWhiteSpace(\)) { continue }
  aws elbv2 register-targets --target-group-arn \ --targets Id=\,Port=5000 --region \
  Write-Host "Registered target: \"
}
