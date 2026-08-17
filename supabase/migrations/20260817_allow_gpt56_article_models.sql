-- Allow the GPT-5.6 model choices exposed by the editorial admin panel.
-- Existing GPT-5.4 values remain valid for old settings and rollback flexibility.
alter table public.portal_settings
  drop constraint if exists portal_settings_article_model_check;

alter table public.portal_settings
  add constraint portal_settings_article_model_check
  check (
    article_model in (
      'gpt-5.4-mini',
      'gpt-5.4',
      'gpt-5.6-luna',
      'gpt-5.6-terra',
      'gpt-5.6-sol'
    )
  );
