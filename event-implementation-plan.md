# App-Ocalypse Event Implementation Plan

## 🎯 15-Minute Crash Wave System

### **Implementation Strategy: Git Branch Deployment**

#### **Branch Structure:**
```
main (competition-ready)
├── wave-0 (start: 8 easy bugs, 115 points)
├── wave-1 (+15min: +9 complex bugs, +155 points) 
├── wave-2 (+30min: +9 security bugs, +285 points)
├── wave-3 (+45min: +10 nightmare bugs, +395 points)
└── bonus-bugs (+12 hidden bonus bugs, +330 points)
```

#### **Team Instructions:**
1. **Event Start:** `git clone <repo> && git checkout wave-0`
2. **Every 15 minutes:** `git checkout wave-X && git pull origin wave-X`
3. **Teams get NEW bugs added to their codebase each wave**

---

## 📅 **Event Timeline (60 Minutes)**

### **Pre-Event (30 minutes before start):**
- [ ] Teams arrive and setup workstations
- [ ] Distribute GitHub repo links and credentials
- [ ] Brief teams on rules and git workflow
- [ ] Test git access and development environment
- [ ] Distribute bug sheets (blank for teams to track their fixes)

### **Event Execution:**

**00:00 - WAVE 0 START**
- [ ] "Welcome to App-Ocalypse! Start with `git checkout wave-0`"
- [ ] 8 basic functional bugs (115 points)
- [ ] Teams explore codebase and start fixing

**15:00 - WAVE 1 DEPLOY** 🌊
- [ ] "Crash Wave 1 incoming! Execute: `git checkout wave-1 && git pull`"
- [ ] +9 complex functional bugs (+155 points) 
- [ ] Announce: "New bugs injected. Assess and prioritize!"

**30:00 - WAVE 2 DEPLOY** 🌊🌊
- [ ] "Security breach detected! Execute: `git checkout wave-2 && git pull`"
- [ ] +9 critical security vulnerabilities (+285 points)
- [ ] Announce: "Production is under attack. Priority: Security fixes!"

**45:00 - WAVE 3 DEPLOY** 🌊🌊🌊
- [ ] "Final crash wave! All hands on deck! Execute: `git checkout wave-3 && git pull`"
- [ ] +10 nightmare-level bugs (+395 points)
- [ ] Announce: "System critical. Expert-level debugging required!"

**60:00 - EVENT END**
- [ ] "Time's up! Final commits in 2 minutes!"
- [ ] Teams submit via final git push
- [ ] Begin judging and scoring

---

## 🏆 **Judging & Scoring System**

### **Automated Scoring Script:**
```bash
# For each team repository:
for team in team-*; do
    cd $team
    echo "Scoring $team..."
    
    # Count fixed bugs by category
    functional_fixes=$(grep -l "fixed" js/*.js | wc -l)
    security_fixes=$(grep -l "sanitize\|escape\|validate" js/*.js | wc -l)
    
    # Analyze commit quality
    commits=$(git log --oneline | wc -l)
    commit_messages=$(git log --pretty=format:"%s" | grep -E "(fix|bug|security)" | wc -l)
    
    # Test if application still works
    npm test > test_results.txt 2>&1
    working_features=$(grep "passing" test_results.txt | cut -d' ' -f1)
    
    echo "$team: $functional_fixes functional, $security_fixes security, $commits commits, $working_features features working"
done
```

### **Scoring Breakdown:**
1. **Bug Fixes (70%)**: Points per bug based on wave-distribution.csv
2. **Code Quality (15%)**: Readable commits, proper fixes vs. hacks
3. **Features Restored (10%)**: Application functionality maintained
4. **Wave Survival (5%)**: Bonus for teams that survive all waves

### **Special Recognition:**
- **🧙 App Whisperer**: Most total points
- **🛡️ Crash Survivor**: Survived all 4 waves with working app
- **🔍 Bug Whisperer**: Found and fixed bonus hidden bugs

---

## 🛠️ **Technical Setup Requirements**

### **Organizer Checklist:**
- [ ] Create 4 git branches with progressive bug injection
- [ ] Prepare judging laptops/scripts
- [ ] Set up projection screen for announcements
- [ ] Timer system for 15-minute intervals
- [ ] Backup plans for git/network issues

### **Team Requirements:**
- [ ] Laptops with git, Node.js, modern browser
- [ ] GitHub account access
- [ ] Code editor (VS Code recommended)
- [ ] Terminal access

### **Network & Infrastructure:**
- [ ] Stable WiFi for all teams
- [ ] GitHub access confirmed
- [ ] Backup USB drives with repo zip files
- [ ] Power outlets for all teams

---

## 🚨 **Panic Button System**

### **Implementation:**
Teams can use ONE panic button per event:
- **Cost**: -50 points from final score
- **Benefit**: 10-minute hint session with organizer
- **Usage**: Teams raise red card/flag

### **Hint Guidelines:**
- Point towards bug location (file name)
- Explain bug category (XSS, logic error, etc.)  
- NO direct solutions or code fixes
- Encourage systematic debugging approach

---

## 📊 **Live Monitoring Dashboard**

### **Real-time Tracking:**
```
Team Name    | Wave | Commits | Score | Status
-------------|------|---------|-------|--------
Team Alpha   |  2   |   12    |  340  | 🟢 Active
Team Beta    |  1   |    8    |  180  | 🟡 Struggling  
Team Gamma   |  3   |   15    |  520  | 🔥 Leading
```

### **Announcements Schedule:**
- **00:00**: Event start, wave-0 deployment
- **15:00**: Wave-1 deployment + current standings
- **30:00**: Wave-2 deployment + security focus reminder
- **45:00**: Wave-3 deployment + final push motivation  
- **55:00**: "5 minutes remaining!"
- **60:00**: "Time's up! Final submissions!"

---

## 🎉 **Post-Event Activities**

### **Immediate (10 minutes):**
- [ ] Collect final repositories
- [ ] Run automated scoring scripts
- [ ] Manual verification of top fixes

### **Awards Ceremony (20 minutes):**
- [ ] Announce winners in each category
- [ ] Highlight most creative fixes
- [ ] Demo the most critical bugs found
- [ ] Team appreciation and photos

### **Learning Session (15 minutes):**
- [ ] Walkthrough of all 46 bugs
- [ ] Explain real-world impact
- [ ] Best practices for prevention
- [ ] Q&A with participants

This implementation provides a **controlled, scalable, and exciting** debugging survival experience that mimics real production pressure!