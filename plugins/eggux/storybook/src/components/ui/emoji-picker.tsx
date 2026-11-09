// EGG UI Emoji Picker. Figma: Emoji Picker (Popover page, "Emoji Picker / Component", symbol
// 432:5073). Pick an emoji for a status, a workspace icon or a comment: a Command Input search,
// category tabs (32 x 28, radius sm, 16 px icons, current = background/accent; Recent, Smileys,
// Hearts, Objects, Ideas, World: history, smile, heart, sparkles, lightbulb, globe), the current
// category as a section label (ui/caption muted) and a grid of 34 px emoji cells (body/lead
// 20/28, radius sm), 8 per row, 2 px apart; recently used first. 8 px padding and gap: it is the
// content of a 320 wide PopoverContent opened from a smiley Button Icon (className="w-80 p-2").
// Keyboard: the search keeps focus and is the combobox of the grid (a listbox, one tab stop,
// aria-activedescendant); Down / Up move a row, Left / Right move one cell while the search is
// empty, Enter picks the highlighted emoji. Each emoji has its name as accessible name. Search
// matches names and keywords ("check", "party"); no match says "No emoji found". Category tabs
// are buttons with aria-label and aria-pressed.
// Not built: the skin tone choice (remembered per person) needs a stored preference.
import * as React from 'react';
import { Globe, Heart, History, Lightbulb, Smile, Sparkles } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CommandInput } from './command';

export interface Emoji {
  char: string;
  name: string;
  keywords?: string[];
}

const e = (char: string, name: string, ...keywords: string[]): Emoji => ({ char, name, keywords });

/** Figma "Frequently used": the default recent list. */
const defaultRecent: Emoji[] = [
  e('👍', 'thumbs up', 'like', 'yes', 'ok'), e('🎉', 'party popper', 'party', 'celebrate', 'congrats'), e('❤️', 'red heart', 'love'),
  e('😀', 'grinning face', 'smile', 'happy'), e('🚀', 'rocket', 'launch', 'ship'), e('✅', 'check mark button', 'check', 'done', 'yes'),
  e('👀', 'eyes', 'look', 'watching'), e('🙏', 'folded hands', 'thanks', 'please'), e('🔥', 'fire', 'hot', 'lit'),
  e('💡', 'light bulb', 'idea'), e('📌', 'pushpin', 'pin'), e('⭐', 'star', 'favorite'),
  e('😂', 'face with tears of joy', 'laugh', 'lol'), e('🤝', 'handshake', 'deal', 'agree'), e('📈', 'chart increasing', 'growth', 'up'),
  e('🎯', 'direct hit', 'target', 'goal'),
];

export interface EmojiCategory {
  id: string;
  /** Section label and the tab's accessible name. */
  label: string;
  icon: React.ReactNode;
  emojis: Emoji[];
}

const builtInCategories: EmojiCategory[] = [
  { id: 'smileys', label: 'Smileys', icon: <Smile />, emojis: [
    e('😀', 'grinning face', 'smile', 'happy'), e('😃', 'grinning face with big eyes', 'happy'), e('😄', 'grinning face with smiling eyes', 'happy'),
    e('😁', 'beaming face', 'grin'), e('😅', 'grinning face with sweat', 'relief'), e('😂', 'face with tears of joy', 'laugh', 'lol'),
    e('🙂', 'slightly smiling face', 'smile'), e('😉', 'winking face', 'wink'), e('😊', 'smiling face with smiling eyes', 'blush'),
    e('😍', 'smiling face with heart eyes', 'love'), e('🤔', 'thinking face', 'hmm', 'think'), e('😐', 'neutral face', 'meh'),
    e('😴', 'sleeping face', 'tired', 'sleep'), e('😮', 'face with open mouth', 'wow', 'surprise'), e('😢', 'crying face', 'sad'),
    e('😎', 'smiling face with sunglasses', 'cool'),
  ] },
  { id: 'hearts', label: 'Hearts and hands', icon: <Heart />, emojis: [
    e('❤️', 'red heart', 'love'), e('🧡', 'orange heart', 'love'), e('💛', 'yellow heart', 'love'), e('💚', 'green heart', 'love'),
    e('💙', 'blue heart', 'love'), e('💜', 'purple heart', 'love'), e('🖤', 'black heart', 'love'), e('🤍', 'white heart', 'love'),
    e('👍', 'thumbs up', 'like', 'yes', 'ok'), e('👎', 'thumbs down', 'dislike', 'no'), e('👏', 'clapping hands', 'applause', 'bravo'),
    e('🙌', 'raising hands', 'celebrate', 'hooray'), e('🙏', 'folded hands', 'thanks', 'please'), e('🤝', 'handshake', 'deal', 'agree'),
    e('👋', 'waving hand', 'hello', 'bye'), e('💪', 'flexed biceps', 'strong'),
  ] },
  { id: 'objects', label: 'Celebration and objects', icon: <Sparkles />, emojis: [
    e('🎉', 'party popper', 'party', 'celebrate', 'congrats'), e('🎊', 'confetti ball', 'party', 'celebrate'), e('✨', 'sparkles', 'new', 'magic'),
    e('🎁', 'wrapped gift', 'present', 'birthday'), e('🏆', 'trophy', 'win', 'award'), e('🥇', 'first place medal', 'win', 'gold'),
    e('⭐', 'star', 'favorite'), e('🚀', 'rocket', 'launch', 'ship'), e('📌', 'pushpin', 'pin'), e('📎', 'paperclip', 'attach'),
    e('📅', 'calendar', 'date', 'schedule'), e('💼', 'briefcase', 'work'), e('💰', 'money bag', 'money', 'cash'),
    e('🧾', 'receipt', 'invoice', 'bill'), e('📦', 'package', 'box', 'delivery'), e('🔒', 'locked', 'secure', 'private'),
  ] },
  { id: 'ideas', label: 'Ideas and symbols', icon: <Lightbulb />, emojis: [
    e('💡', 'light bulb', 'idea'), e('🎯', 'direct hit', 'target', 'goal'), e('📈', 'chart increasing', 'growth', 'up'),
    e('📉', 'chart decreasing', 'down'), e('✅', 'check mark button', 'check', 'done', 'yes'), e('❌', 'cross mark', 'no', 'wrong'),
    e('⚠️', 'warning', 'alert', 'caution'), e('❓', 'question mark', 'question'), e('❗', 'exclamation mark', 'important'),
    e('🔥', 'fire', 'hot', 'lit'), e('⚡', 'high voltage', 'fast', 'zap'), e('🧠', 'brain', 'smart', 'think'),
    e('👀', 'eyes', 'look', 'watching'), e('💬', 'speech balloon', 'comment', 'chat'), e('🔔', 'bell', 'notification'),
    e('⏰', 'alarm clock', 'time', 'deadline'),
  ] },
  { id: 'world', label: 'Travel and places', icon: <Globe />, emojis: [
    e('🌍', 'globe Europe Africa', 'world', 'earth'), e('🌎', 'globe Americas', 'world', 'earth'), e('🌏', 'globe Asia Australia', 'world', 'earth'),
    e('🏢', 'office building', 'office', 'work'), e('🏠', 'house', 'home'), e('✈️', 'airplane', 'travel', 'flight'),
    e('🚗', 'car', 'drive'), e('🚆', 'train', 'travel'), e('⛰️', 'mountain', 'hike'), e('🏖️', 'beach with umbrella', 'holiday', 'vacation'),
    e('☀️', 'sun', 'weather', 'sunny'), e('🌧️', 'cloud with rain', 'weather', 'rain'), e('❄️', 'snowflake', 'winter', 'cold'),
    e('🌈', 'rainbow', 'weather'), e('☕', 'hot beverage', 'coffee', 'tea'), e('🍕', 'pizza', 'food', 'lunch'),
  ] },
];

function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const COLUMNS = 8;

export interface EmojiPickerProps extends Omit<React.ComponentProps<'div'>, 'onSelect'> {
  /** Called with the picked emoji; the Popover around it closes. */
  onSelect?: (emoji: Emoji) => void;
  /** Recently used emojis, most recent first. Default the Figma "Frequently used" set. */
  recent?: Emoji[];
  /** The categories after Recent. Default Smileys, Hearts, Objects, Ideas, World. */
  categories?: EmojiCategory[];
  /** Search placeholder and accessible name. */
  searchLabel?: string;
  /** Shown when the search matches nothing. */
  emptyMessage?: string;
}

function EmojiPicker({
  onSelect,
  recent = defaultRecent,
  categories = builtInCategories,
  searchLabel = 'Search emoji',
  emptyMessage = 'No emoji found',
  className,
  ...props
}: EmojiPickerProps) {
  const id = React.useId();
  const tabs = React.useMemo<EmojiCategory[]>(
    () => [{ id: 'recent', label: 'Frequently used', icon: <History />, emojis: recent }, ...categories],
    [recent, categories],
  );
  const [tabId, setTabId] = React.useState(tabs[0].id);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);

  const searching = query.trim() !== '';
  const current = tabs.find(t => t.id === tabId) ?? tabs[0];
  const list = React.useMemo(() => {
    if (!searching) return current.emojis;
    const q = normalize(query.trim());
    const seen = new Set<string>();
    return tabs
      .flatMap(t => t.emojis)
      .filter(item => {
        if (seen.has(item.char)) return false;
        const hit = [item.name, ...(item.keywords ?? [])].some(text => normalize(text).includes(q));
        if (hit) seen.add(item.char);
        return hit;
      });
  }, [searching, query, current, tabs]);
  const index = Math.min(active, Math.max(list.length - 1, 0));
  const optionId = (i: number) => `${id}-emoji-${i}`;

  React.useEffect(() => {
    document.getElementById(optionId(index))?.scrollIntoView?.({ block: 'nearest' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const pick = (item: Emoji | undefined) => {
    if (item) onSelect?.(item);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || list.length === 0) return;
    const last = list.length - 1;
    let next: number | null = null;
    if (event.key === 'ArrowDown') next = Math.min(index + COLUMNS, last);
    else if (event.key === 'ArrowUp') next = Math.max(index - COLUMNS, 0);
    else if (event.key === 'ArrowRight' && !query) next = Math.min(index + 1, last);
    else if (event.key === 'ArrowLeft' && !query) next = Math.max(index - 1, 0);
    else if (event.key === 'Enter') {
      event.preventDefault();
      pick(list[index]);
      return;
    }
    if (next !== null) {
      event.preventDefault();
      setActive(next);
    }
  };

  const sectionId = `${id}-section`;
  return (
    <div data-slot="emoji-picker" className={cn('flex w-full min-w-0 flex-col gap-2', className)} {...props}>
      <CommandInput
        role="combobox"
        aria-label={searchLabel}
        aria-expanded={true}
        aria-controls={`${id}-grid`}
        aria-autocomplete="list"
        aria-activedescendant={list.length ? optionId(index) : undefined}
        placeholder={searchLabel}
        value={query}
        onChange={event => {
          setQuery(event.target.value);
          setActive(0);
        }}
        onKeyDown={onKeyDown}
      />
      <div data-slot="emoji-picker-categories" className="flex items-center gap-1">
        {tabs.map(tab => {
          const pressed = !searching && tab.id === current.id;
          return (
            <button
              key={tab.id}
              type="button"
              aria-label={tab.id === 'recent' ? 'Recent' : tab.label}
              aria-pressed={pressed}
              onClick={() => {
                setTabId(tab.id);
                setQuery('');
                setActive(0);
              }}
              className="flex h-7 w-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:shadow-[0_0_0_2px_var(--background),0_0_0_4px_var(--ring)] aria-pressed:bg-accent aria-pressed:text-accent-foreground [&_svg]:size-4"
            >
              <span aria-hidden="true" className="flex">{tab.icon}</span>
            </button>
          );
        })}
      </div>
      <p id={sectionId} data-slot="emoji-picker-section" className="text-xs leading-4 text-muted-foreground">
        {searching ? 'Search results' : current.label}
      </p>
      <div
        role="listbox"
        id={`${id}-grid`}
        aria-labelledby={sectionId}
        data-slot="emoji-picker-grid"
        className={cn('grid max-h-[178px] grid-cols-[repeat(8,34px)] gap-0.5 overflow-y-auto', list.length === 0 && 'hidden')}
      >
        {list.map((item, i) => (
          <div
            key={`${item.char}-${i}`}
            id={optionId(i)}
            role="option"
            aria-label={item.name}
            aria-selected={i === index}
            data-highlighted={i === index ? '' : undefined}
            tabIndex={-1}
            onMouseDown={event => event.preventDefault()}
            onMouseMove={() => setActive(i)}
            onClick={() => pick(item)}
            className="flex size-[34px] cursor-default select-none items-center justify-center rounded-sm text-xl leading-7 text-foreground hover:bg-accent data-[highlighted]:bg-accent"
          >
            <span aria-hidden="true">{item.char}</span>
          </div>
        ))}
      </div>
      <div role="status" data-slot="emoji-picker-empty">
        {list.length === 0 ? <p className="py-6 text-center text-sm leading-5 text-muted-foreground">{emptyMessage}</p> : null}
      </div>
    </div>
  );
}

export { EmojiPicker, builtInCategories as emojiCategories, defaultRecent as defaultRecentEmojis };
