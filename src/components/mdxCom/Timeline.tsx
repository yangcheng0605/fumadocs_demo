'use client';

import React from 'react';

export interface TimelineItemProps {
  date: string;
  title: string;
  content: React.ReactNode;
  version?: string;
}

export interface TimelineProps {
  items: TimelineItemProps[];
}

export function TimelineItem({ date, title, content, version }: TimelineItemProps) {
  return (
    <div className="mb-10 ml-4">
      <div className="absolute w-3 h-3 bg-emerald-600 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-emerald-500"></div>
      <div className="flex items-center mb-1">
        <time className="text-sm font-normal leading-none text-gray-500 dark:text-gray-400 mr-2">{date}</time>
        {version && (
          <div className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-800 rounded dark:bg-emerald-900 dark:text-emerald-300">
            v{version}
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      <div className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
        {content}
      </div>
    </div>
  );
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 pl-6 mt-8">
      {items.map((item, index) => (
        <TimelineItem key={index} {...item} />
      ))}
    </div>
  );
} 