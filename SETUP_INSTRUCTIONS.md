# הוראות הגדרה לפרסום ng-code-scanner ב-npm

## שלב 1: יצירת רפוזיטורי ב-GitHub

1. גש ל-https://github.com/new
2. שם הרפוזיטורי: `ng-code-scanner`
3. תיאור: `Modern Angular library for barcode and QR code scanning with Signal-based state management`
4. בחר: **Public**
5. **אל תסמן** את האופציות:
   - Add a README file
   - Add .gitignore
   - Choose a license
6. לחץ על **Create repository**

## שלב 2: דחיפת הקוד ל-GitHub

הרץ את הפקודות הבאות בטרמינל:

```bash
cd /Users/danielgabbay/Software/private/ng-code-scanner/ng-code-scanner-workspace

# הוספת ה-remote
git remote add origin https://github.com/DanielGabbay/ng-code-scanner.git

# דחיפת הקוד ל-main branch
git push -u origin main
```

## שלב 3: יצירת npm Access Token

1. גש ל-https://www.npmjs.com/
2. התחבר לחשבון שלך (או צור חשבון חדש)
3. לחץ על הפרופיל שלך (למעלה מימין) ➜ **Access Tokens**
4. לחץ על **Generate New Token** ➜ **Classic Token**
5. שם: `GitHub Actions - ng-code-scanner`
6. סוג: **Automation**
7. לחץ על **Generate Token**
8. **העתק את ה-token** (לא תוכל לראות אותו שוב!)

## שלב 4: הוספת ה-npm Token ל-GitHub Secrets

1. גש לרפוזיטורי ב-GitHub: https://github.com/DanielGabbay/ng-code-scanner
2. לחץ על **Settings** (בתפריט למעלה)
3. בתפריט הצד, לחץ על **Secrets and variables** ➜ **Actions**
4. לחץ על **New repository secret**
5. שם: `NPM_TOKEN`
6. ערך: הדבק את ה-token שהעתקת
7. לחץ על **Add secret**

## שלב 5: בדיקה

כעת, בכל פעם שתדחוף שינויים ל-main branch:

```bash
# עדכן את מספר הגרסה ב-package.json
# לדוגמה: "version": "1.0.1"

git add projects/ng-code-scanner/package.json
git commit -m "Bump version to 1.0.1"
git push origin main
```

GitHub Actions יבדוק אוטומטית:
- אם מספר הגרסה השתנה
- אם הגרסה הזאת כבר לא קיימת ב-npm

אם שני התנאים מתקיימים, הספרייה תפורסם אוטומטית ל-npm!

## שלב 6: פרסום ידני ראשוני (אופציונלי)

אם אתה רוצה לפרסם את הגרסה הראשונה ידנית:

```bash
cd /Users/danielgabbay/Software/private/ng-code-scanner/ng-code-scanner-workspace

# התחבר ל-npm
npm login

# בנה ופרסם
npm run build:lib:prod
cd dist/ng-code-scanner
npm publish
```

## בדיקת הפרסום

לאחר הפרסום, תוכל להתקין את הספרייה:

```bash
npm install ng-code-scanner
```

ולראות אותה ב-npm: https://www.npmjs.com/package/ng-code-scanner

## עדכונים עתידיים

לעדכון הספרייה:

1. ערוך את הקוד
2. עדכן את `version` ב-`projects/ng-code-scanner/package.json`
3. עדכן את `CHANGELOG.md`
4. Commit ו-Push:
   ```bash
   git add .
   git commit -m "Update to version X.Y.Z"
   git push origin main
   ```

GitHub Actions יטפל בשאר אוטומטית!
