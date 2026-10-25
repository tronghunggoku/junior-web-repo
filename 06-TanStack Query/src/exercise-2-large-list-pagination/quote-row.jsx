/** 1 dòng quote — dùng chung cho list phân trang và infinite. */
export function QuoteRow({ quote }) {
  return (
    <li className="quote-row">
      <span className="quote-id">#{quote.id}</span>
      <blockquote>
        “{quote.quote}”<footer>— {quote.author}</footer>
      </blockquote>
    </li>
  );
}
