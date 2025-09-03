# 🚀 Deployment Guide for AnimeRec App

## Quick Deploy to Vercel (Recommended)

### Method 1: Vercel Dashboard (Easiest)

1. **Visit Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with your GitHub account (meccode360@gmail.com)

2. **Import Repository**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose `mecdocode/animerecom` from your GitHub repos
   - Click "Import"

3. **Configure Project**
   - Project Name: `animerecom` (or your preferred name)
   - Framework Preset: `Create React App` (should auto-detect)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build` (should auto-fill)
   - Output Directory: `build` (should auto-fill)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   ```
   REACT_APP_OPENROUTER_API_KEY = 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
   REACT_APP_OPENROUTER_MODEL = meta-llama/llama-3.2-3b-instruct:free
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://animerecom.vercel.app`

### Method 2: Vercel CLI (Alternative)

If you prefer command line:

1. **Login to Vercel**
   ```bash
   vercel login
   ```
   - Enter your email: meccode360@gmail.com
   - Check your email for verification code

2. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts:
     - Set up and deploy? `Y`
     - Which scope? Select your account
     - Link to existing project? `N`
     - Project name: `animerecom`
     - Directory: `./` (press Enter)

3. **Add Environment Variables**
   ```bash
   vercel env add REACT_APP_OPENROUTER_API_KEY
   ```
   Enter: `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`

   ```bash
   vercel env add REACT_APP_OPENROUTER_MODEL
   ```
   Enter: `meta-llama/llama-3.2-3b-instruct:free`

4. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## 🔧 Post-Deployment Steps

1. **Test Your Live App**
   - Visit your Vercel URL
   - Test the quiz functionality
   - Test the search functionality
   - Verify AI recommendations work

2. **Custom Domain (Optional)**
   - In Vercel dashboard, go to Project Settings
   - Click "Domains"
   - Add your custom domain if you have one

3. **Enable Analytics (Optional)**
   - In Vercel dashboard, enable Analytics
   - Monitor your app's performance

## 🔍 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure no TypeScript errors
- Verify environment variables are set

### App Loads but Recommendations Don't Work
- Check environment variables in Vercel dashboard
- Verify OpenRouter API key is valid
- Check browser console for errors

### Slow Loading
- Enable Vercel Analytics to monitor performance
- Consider upgrading to Vercel Pro for better performance

## 📱 Expected URLs

After deployment, your app will be available at:
- **Primary**: `https://animerecom.vercel.app`
- **Alternative**: `https://animerecom-git-main-mecdocode.vercel.app`
- **Preview**: `https://animerecom-mecdocode.vercel.app`

## 🎯 Features to Test

1. **Landing Page**: Should load with trending anime
2. **Quiz Flow**: Take quiz → Get recommendations
3. **Search Flow**: Search anime → Select favorites → Get recommendations
4. **Anime Details**: Click any anime card → View details
5. **Responsive Design**: Test on mobile/tablet

## 🔄 Future Updates

To update your deployed app:
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```
3. Vercel will automatically redeploy!

## 📞 Support

If you encounter issues:
- Check Vercel deployment logs in dashboard
- Email: meccode360@gmail.com
- GitHub Issues: https://github.com/mecdocode/animerecom/issues

---

**Your app should be live within 5 minutes! 🎉**
