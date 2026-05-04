# Security Specification for SIMPHONY

## Data Invariants
1. A user can only read and write their own profile document in `/users/{userId}`.
2. Community posts in `/posts/` can be read by any authenticated user, but only the author can edit or delete them.
3. Consultations in `/consultations/` can only be read/written by the user who created it or a school administrator/counselor.
4. Peer messages in `/peer_messages/` are private to the sender and the designated recipient (via admin).
5. Mood entries in `/moods/` are private to the user who created them.
6. The `role` or any administrative field cannot be self-assigned.

## The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Identity Spoofing**: Attempt to create a post with `authorId` set to another user's UID.
2. **Post Hijacking**: Attempt to update another user's post content.
3. **Ghost Post**: Attempt to create a post without a valid `authorId` or missing `content`.
4. **Consultation Snooping**: Attempt to read a consultation document belonging to another user.
5. **Admin Escalation**: Attempt to update user profile to set a field like `isAdmin: true`.
6. **Mood Tampering**: Attempt to delete another user's mood log entries.
7. **Tree Hack**: Attempt to set `treeLevel` to 1,000,000.
8. **Spam Creation**: Attempt to create a post with content exceeding 10,000 characters.
9. **Private Path Injection**: Attempt to create a document in a restricted "admins" only path.
10. **Time Spoofing**: Attempt to set `createdAt` to a future date instead of server timestamp.
11. **Peer Message Leak**: Attempt to list all peer messages without being the sender.
12. **Status Shortcutting**: Attempt to close a consultation without being the owner or counselor.

## Test Runner Plan
A `firestore.rules.test.ts` file will be created to verify these denials once rules are implemented.
