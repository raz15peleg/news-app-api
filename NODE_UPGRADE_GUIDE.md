# Node.js 20 Upgrade Guide

## 🚀 **Upgrade to Node.js 20**

This guide will help you upgrade your development environment to Node.js 20+ for better performance and compatibility.

## 📋 **Current Status**
- **Current Node.js Version**: 16.20.2
- **Target Node.js Version**: 20.x
- **Current npm Version**: 8.19.4
- **Target npm Version**: 10.x+

## 🔧 **Upgrade Methods**

### **Option 1: Using nvm (Recommended)**

```bash
# Install nvm if you haven't already
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc  # or source ~/.zshrc

# Install Node.js 20
nvm install 20

# Use Node.js 20
nvm use 20

# Set as default
nvm alias default 20
```

### **Option 2: Using Homebrew (macOS)**

```bash
# Update Homebrew
brew update

# Install Node.js 20
brew install node@20

# Link it
brew link node@20

# Verify installation
node --version
npm --version
```

### **Option 3: Direct Download**

Visit [nodejs.org](https://nodejs.org/) and download Node.js 20 LTS.

## ✅ **What's Been Updated**

### **1. Docker Configurations**
- ✅ `frontend/Dockerfile` - Updated to `node:20-alpine`
- ✅ `frontend/Dockerfile.dev` - Updated to `node:20-alpine`

### **2. Package Configuration**
- ✅ `frontend/package.json` - Updated engines to Node.js >=20.0.0
- ✅ `frontend/.nvmrc` - Created to specify Node.js 20

### **3. Build Configuration**
- ✅ `frontend/vite.config.ts` - Updated target to ES2020
- ✅ TypeScript configs are already compatible

## 🧪 **Testing After Upgrade**

### **1. Verify Installation**
```bash
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### **2. Clean Install Dependencies**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### **3. Test Build**
```bash
npm run build
```

### **4. Test Development Server**
```bash
npm run dev
```

## 🐳 **Docker Build Testing**

### **Production Build**
```bash
cd frontend
docker build -t news-app-frontend .
```

### **Development Build**
```bash
cd frontend
docker build -f Dockerfile.dev -t news-app-frontend-dev .
```

## 🔍 **Benefits of Node.js 20**

1. **Performance**: Up to 20% faster startup times
2. **Security**: Latest security patches and improvements
3. **Compatibility**: Better support for modern packages
4. **Features**: Enhanced ES modules support
5. **Stability**: LTS version with long-term support

## ⚠️ **Potential Issues & Solutions**

### **1. Package Compatibility**
If you encounter package compatibility issues:
```bash
npm audit fix
npm update
```

### **2. Global Packages**
Reinstall global packages after Node.js upgrade:
```bash
npm list -g --depth=0  # List global packages
npm install -g <package-name>  # Reinstall needed packages
```

### **3. Environment Variables**
Ensure your PATH includes the new Node.js installation:
```bash
echo $PATH | grep node
```

## 📝 **Post-Upgrade Checklist**

- [ ] Node.js version is 20.x
- [ ] npm version is 10.x
- [ ] All dependencies install correctly
- [ ] Build process works
- [ ] Development server starts
- [ ] Docker builds work
- [ ] No TypeScript errors
- [ ] All tests pass (if applicable)

## 🆘 **Rollback Plan**

If you need to rollback to Node.js 16:
```bash
# Using nvm
nvm install 16
nvm use 16
nvm alias default 16

# Or reinstall Node.js 16 from nodejs.org
```

## 📞 **Support**

If you encounter any issues during the upgrade:
1. Check the [Node.js 20 migration guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
2. Review package compatibility in their documentation
3. Check for breaking changes in major dependencies 