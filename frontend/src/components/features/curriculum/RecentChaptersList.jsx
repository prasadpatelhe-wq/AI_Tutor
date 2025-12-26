/**
 * RecentChaptersList - Memoized list of recent chapters
 *
 * This component demonstrates proper memoization to prevent unnecessary re-renders.
 * It only re-renders when the chapters array actually changes.
 */

import React, { memo, useMemo } from 'react';
import { colors, spacing, typography } from '../../../design/designSystem';

const ChapterItem = memo(({ chapter, onClick }) => {
  return (
    <button style={styles.chapterItem} onClick={() => onClick(chapter)}>
      <div style={styles.chapterIcon}>📚</div>
      <div style={styles.chapterInfo}>
        <span style={styles.chapterName}>{chapter.chapter}</span>
        <span style={styles.chapterSubject}>{chapter.subject}</span>
      </div>
      <div style={styles.arrow}>→</div>
    </button>
  );
});

ChapterItem.displayName = 'ChapterItem';

const RecentChaptersList = memo(({ chapters = [], onChapterClick, maxItems = 5 }) => {
  // Memoize the filtered/sliced chapters
  const visibleChapters = useMemo(
    () => chapters.slice(0, maxItems),
    [chapters, maxItems]
  );

  if (visibleChapters.length === 0) {
    return (
      <div style={styles.emptyState}>
        <span style={styles.emptyIcon}>📖</span>
        <p style={styles.emptyText}>No recent chapters yet</p>
        <p style={styles.emptySubtext}>Start learning to see your history here</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Recent Chapters</h3>
      <div style={styles.list}>
        {visibleChapters.map((chapter, index) => (
          <ChapterItem
            key={chapter.chapterId || index}
            chapter={chapter}
            onClick={onChapterClick}
          />
        ))}
      </div>
    </div>
  );
});

RecentChaptersList.displayName = 'RecentChaptersList';

const styles = {
  container: {
    backgroundColor: colors.neutral[0],
    borderRadius: '16px',
    padding: spacing[5],
    border: `1px solid ${colors.neutral[200]}`,
  },
  title: {
    fontFamily: typography.fontFamily.display,
    fontSize: '1rem',
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[800],
    margin: `0 0 ${spacing[4]} 0`,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[2],
  },
  chapterItem: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[3],
    padding: spacing[3],
    backgroundColor: colors.neutral[50],
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'left',
    transition: 'background-color 0.15s ease',
  },
  chapterIcon: {
    fontSize: '1.25rem',
  },
  chapterInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing[0.5],
  },
  chapterName: {
    fontFamily: typography.fontFamily.body,
    fontSize: '0.875rem',
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[900],
  },
  chapterSubject: {
    fontFamily: typography.fontFamily.body,
    fontSize: '0.75rem',
    color: colors.neutral[500],
  },
  arrow: {
    color: colors.neutral[400],
    fontSize: '1rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing[8],
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '2.5rem',
    marginBottom: spacing[3],
  },
  emptyText: {
    fontFamily: typography.fontFamily.body,
    fontSize: '1rem',
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
    margin: 0,
  },
  emptySubtext: {
    fontFamily: typography.fontFamily.body,
    fontSize: '0.875rem',
    color: colors.neutral[500],
    margin: `${spacing[2]} 0 0 0`,
  },
};

export default RecentChaptersList;
