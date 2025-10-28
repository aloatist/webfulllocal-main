# n8n Workflows for Social Media Automation

## 📋 Overview

These n8n workflows handle automated posting to social media platforms.

## 🚀 Setup Instructions

### 1. Access n8n Dashboard
```bash
# Make sure n8n is running
docker-compose up -d n8n

# Access at
http://localhost:5678
```

### 2. Import Workflows

1. Open n8n dashboard
2. Click **Workflows** → **Import from File**
3. Import `social-media-publisher.json`

### 3. Configure Credentials

#### Facebook/Instagram
1. Go to **Credentials** → **Add Credential**
2. Select **Facebook Graph API**
3. Enter:
   - **App ID**: Your Facebook App ID
   - **App Secret**: Your Facebook App Secret
   - **Access Token**: Page Access Token

#### Twitter/X
1. Select **Twitter API v2**
2. Enter:
   - **API Key**
   - **API Secret**
   - **Access Token**
   - **Access Token Secret**

#### YouTube
1. Select **Google OAuth2**
2. Enter:
   - **Client ID**
   - **Client Secret**
   - Complete OAuth flow

### 4. Set Environment Variables

Add to `.env`:
```bash
# n8n Webhook URLs
N8N_WEBHOOK_URL=http://localhost:5678/webhook/social-media-publish
N8N_WEBHOOK_SECRET=your-secret-key-here

# Callback URL (for n8n to call back)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Test Workflow

1. Open workflow in n8n
2. Click **Execute Workflow**
3. Send test webhook:

```bash
curl -X POST http://localhost:5678/webhook/social-media-publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-key-here" \
  -d '{
    "socialMediaPostId": "test-123",
    "postId": "post-456",
    "accountId": "fb-account-789",
    "platform": "facebook",
    "content": {
      "text": "Test post from n8n!",
      "url": "https://conphungtourist.com"
    },
    "webhookCallbackUrl": "http://localhost:3000"
  }'
```

## 📁 Workflow Files

### social-media-publisher.json
**Main workflow for publishing posts**

**Nodes:**
1. **Webhook Trigger** - Receives publish requests
2. **Platform Router** - Routes to correct platform
3. **Facebook Post** - Posts to Facebook
4. **Instagram Post** - Posts to Instagram  
5. **Success Callback** - Notifies backend of success
6. **Error Callback** - Notifies backend of failure

**Flow:**
```
Webhook → Route by Platform → Post to Platform → Callback → Response
```

## 🔧 Customization

### Adding New Platforms

1. **Add Platform Check Node**
```json
{
  "parameters": {
    "conditions": {
      "string": [{
        "value1": "={{ $json.platform }}",
        "operation": "equals",
        "value2": "youtube"
      }]
    }
  },
  "name": "Is YouTube?",
  "type": "n8n-nodes-base.if"
}
```

2. **Add Post Node**
```json
{
  "parameters": {
    "url": "https://www.googleapis.com/youtube/v3/videos",
    "authentication": "predefinedCredentialType",
    "nodeCredentialType": "googleOAuth2Api"
  },
  "name": "Post to YouTube",
  "type": "n8n-nodes-base.httpRequest"
}
```

3. **Connect to Success/Error Callbacks**

### Modifying Content Format

Edit the post nodes' body parameters:

```json
"bodyParameters": {
  "parameters": [
    {
      "name": "message",
      "value": "={{ $json.content.text }}"
    },
    {
      "name": "hashtags",
      "value": "={{ $json.content.hashtags.join(', ') }}"
    }
  ]
}
```

## 🔐 Security

### Webhook Authentication

The workflow expects:
```
Authorization: Bearer YOUR_SECRET
```

Set in Next.js app:
```bash
N8N_WEBHOOK_SECRET=your-secret-key
```

### API Credentials

Store credentials in n8n's encrypted credential store:
- **Never** hardcode tokens in workflows
- Use n8n's credential system
- Rotate tokens regularly

## 🐛 Debugging

### Enable Execution Logs

1. In n8n Settings:
   - **Log Level**: Debug
   - **Save Execution Progress**: Yes
   - **Save Manual Executions**: Yes

2. View logs:
   - Go to **Executions**
   - Click on failed execution
   - View error details

### Common Issues

#### 1. Webhook Not Triggering
```bash
# Check n8n is running
docker ps | grep n8n

# Check webhook URL
echo $N8N_WEBHOOK_URL

# Test webhook
curl -X POST $N8N_WEBHOOK_URL -d '{"test": true}'
```

#### 2. Platform API Errors
- Check credentials are valid
- Verify API permissions
- Check rate limits
- Review API documentation

#### 3. Callback Failures
- Verify callback URL is accessible
- Check network connectivity
- Verify webhook secret matches

## 📊 Monitoring

### Execution Statistics

View in n8n dashboard:
- **Executions** → **Statistics**
- Success rate
- Average execution time
- Failed executions

### Alert Setup

Configure alerts for:
- Failed executions
- High error rate
- Slow response times

## 🔄 Scheduled Posts Workflow

Create additional workflow for scheduled posts:

**Cron Trigger** → **Query Scheduled Posts** → **For Each** → **Publish**

```json
{
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{ "field": "minutes", "minutesInterval": 5 }]
        }
      },
      "name": "Every 5 Minutes",
      "type": "n8n-nodes-base.cron"
    }
  ]
}
```

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- [YouTube Data API](https://developers.google.com/youtube/v3)

## 🆘 Support

For issues:
1. Check n8n execution logs
2. Review API error messages
3. Test credentials manually
4. Check network connectivity

---

**Last Updated:** October 27, 2025  
**Version:** 1.0.0
