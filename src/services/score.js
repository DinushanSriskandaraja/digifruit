import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

console.log('Firestore db:', db);

export function getCurrentUserId() {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (user) {
        return user.uid;
    } else {
        throw new Error('No user is currently signed in');
    }
}

export async function updateUserScore(newScore, level) {
    try {
        if (!db) throw new Error('Firestore db is not initialized');
        
        const effectiveUserId = getCurrentUserId();
        const userDocRef = doc(db, 'users', effectiveUserId);
        
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const currentData = userDoc.data();
            const currentScores = currentData.score || {};
            const currentLevelScore = currentScores[`Level${level}`] || 0;
            
            if (newScore > currentLevelScore) {
                await updateDoc(userDocRef, {
                    [`score.Level${level}`]: newScore,
                    lastUpdated: new Date().toISOString()
                });
                console.log(`Score for level ${level} updated successfully`);
                return {
                    success: true,
                    message: `New high score updated for level ${level}`,
                    score: newScore,
                    level: level
                };
            } else {
                console.log(`New score for level ${level} not higher than existing score`);
                return {
                    success: false,
                    message: `Score not updated for level ${level} - not a new high score`,
                    score: currentLevelScore,
                    level: level
                };
            }
        } else {
            // Create new user document with initial score
            await setDoc(userDocRef, {
                userId: effectiveUserId,
                username: getAuth().currentUser.displayName || '',
                mail: getAuth().currentUser.email || '',
                score: {
                    [`Level${level}`]: newScore
                },
                gamesPlayed: 1,
                lastUpdated: new Date().toISOString()
            });
            console.log(`New user record created with score for level ${level}`);
            return {
                success: true,
                message: `New score record created for level ${level}`,
                score: newScore,
                level: level
            };
        }
    } catch (error) {
        console.error('Error updating score:', error);
        return {
            success: false,
            message: 'Error updating score',
            error: error.message
        };
    }
}

export async function getUserScore(userId = null, level = null) {
    try {
        if (!db) throw new Error('Firestore db is not initialized');
        
        const effectiveUserId = userId || getCurrentUserId();
        const userDocRef = doc(db, 'users', effectiveUserId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const scores = userData.score || {};
            
            if (level) {
                const levelScore = scores[`Level${level}`] || 0;
                return {
                    success: true,
                    score: levelScore,
                    level: level,
                    lastUpdated: userData.lastUpdated
                };
            }
            
            return {
                success: true,
                score: scores,
                username: userData.username,
                mail: userData.mail,
                gamesPlayed: userData.gamesPlayed || 0,
                lastUpdated: userData.lastUpdated
            };
        } else {
            return {
                success: true,
                score: level ? 0 : {},
                message: 'No score record found'
            };
        }
    } catch (error) {
        console.error('Error getting score:', error);
        return {
            success: false,
            message: 'Error retrieving score',
            error: error.message
        };
    }
}

export async function incrementGamesPlayed(userId = null) {
    try {
        if (!db) throw new Error('Firestore db is not initialized');
        
        const effectiveUserId = userId || getCurrentUserId();
        const userDocRef = doc(db, 'users', effectiveUserId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            await updateDoc(userDocRef, {
                gamesPlayed: (userDoc.data().gamesPlayed || 0) + 1,
                lastUpdated: new Date().toISOString()
            });
        } else {
            await setDoc(userDocRef, {
                userId: effectiveUserId,
                username: getAuth().currentUser.displayName || '',
                mail: getAuth().currentUser.email || '',
                score: {},
                gamesPlayed: 1,
                lastUpdated: new Date().toISOString()
            });
        }
        return { success: true };
    } catch (error) {
        console.error('Error incrementing games played:', error);
        return {
            success: false,
            error: error.message
        };
    }
}