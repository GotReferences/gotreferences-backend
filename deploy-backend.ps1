# deploy-backend.ps1
# Robust ECS redeploy script for GotReferences backend

$ErrorActionPreference = 'Stop'

# === Configurable ===
$AWS_REGION   = "us-east-1"
$REPO_NAME    = "gotreferences-backend"
$CLUSTER_NAME = "GotReferencesBackendCluster"
$SERVICE_NAME = "GotReferencesBackendService"

# === Derived ===
$AWS_ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text | Out-String).Trim()
$ECR_REGISTRY   = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
$ECR_URI        = "$ECR_REGISTRY/$REPO_NAME"

Write-Host "`n=== Deploying $REPO_NAME to $CLUSTER_NAME/$SERVICE_NAME in $AWS_REGION ==="
Write-Host "AWS_ACCOUNT_ID = $AWS_ACCOUNT_ID"
Write-Host "ECR_REGISTRY   = $ECR_REGISTRY"
Write-Host "ECR_URI        = $ECR_URI`n"

# 1) Authenticate to ECR
aws ecr get-login-password --region $AWS_REGION |
  docker login --username AWS --password-stdin $ECR_REGISTRY

# 2) Build, tag, push
docker build -t $REPO_NAME .

$fullTag = "$ECR_URI:latest"
Write-Host "Tagging image with: $fullTag"

docker tag "$REPO_NAME:latest" $fullTag
docker push $fullTag

# 3) Redeploy ECS service
aws ecs update-service `
  --cluster $CLUSTER_NAME `
  --service $SERVICE_NAME `
  --force-new-deployment `
  --region $AWS_REGION | Out-Null

aws ecs wait services-stable `
  --cluster $CLUSTER_NAME `
  --services $SERVICE_NAME `
  --region $AWS_REGION

Write-Host "`n✅ Deployment complete. Test with:"
Write-Host "Invoke-WebRequest https://api.gotreferences.org/api/blog | Select-Object -ExpandProperty Content"
